import mimetypes
import os

from database import Database
from error import HTTPError
from floot import Floot
from floot_comment import FlootComment
from response import Response

SERVER_SRC_DIR = os.path.dirname(os.path.realpath(__file__))
CLIENT_SRC_DIR = os.path.abspath(os.path.join(SERVER_SRC_DIR, "..", "client"))

db = Database()

# GET /
def serve_file(path):
    if not path or path == "/":
        path = "/index.html"
    target_file_path = os.path.abspath(os.path.join(CLIENT_SRC_DIR, path[1:]))
    # Avoid serving files above client source directory for security
    if not target_file_path.startswith(CLIENT_SRC_DIR + os.sep) \
            or not os.path.isfile(target_file_path):
        return HTTPError(404, "File not found")

    with open(target_file_path, "rb") as f:
        # Return the file. Guess the content-type based on the file extension
        return Response(f.read(), content_type=mimetypes.guess_type(target_file_path)[0])

# GET /api/floots
def get_floots():

    result = []
    for floot in db.get_floots():
        result.append(floot.to_dictionary())
    return result


# GET /api/floots/{floot_id}
def get_floot(floot_id):
    
    if db.has_floot(floot_id):
        return db.get_floot_by_id(floot_id).to_dictionary()
    else:
        return HTTPError(404, "floot could not be found")

# POST /api/floots
def create_floot(request_body):

    if "message" not in request_body:
        return HTTPError(400, "message could not be found")
    message = request_body["message"]

    if "username" not in request_body:
        return HTTPError(400, "username could not be found")
    username = request_body["username"]

    floot = Floot(message, username)

    db.save_floot(floot)

    return floot.to_dictionary()

# POST /api/floots/{floot_id}/delete
def delete_floot(floot_id, request_body):

    if not db.has_floot(floot_id): return HTTPError(404, "floot could not be found")

    if "username" not in request_body:
        return HTTPError(400, "username could not be found")
    username = request_body["username"]

    floot = db.get_floot_by_id(floot_id)
    if floot.get_username() != username: return HTTPError(401, "user deleting is not the same as user who posted floot")

    db.delete_floot_by_id(floot_id)
    return "OK"

# GET /api/floot/{floot_id}/comments
def get_comments(floot_id):

    if not db.has_floot(floot_id): return HTTPError(404, "floot could not be found")

    floot = db.get_floot_by_id(floot_id)
    result = []
    for comment in floot.get_comments():
        result.append(comment.to_dictionary())
    return result

# POST /api/floots/{floot_id}/comments
def create_comment(floot_id, request_body):

    if not db.has_floot(floot_id): return HTTPError(404, "floot could not be found")

    if "message" not in request_body:
        return HTTPError(400, "comment message could not be found")
    message = request_body["message"]

    if "username" not in request_body:
        return HTTPError(400, "username could not be found")
    username = request_body["username"]

    floot = db.get_floot_by_id(floot_id)
    comment = FlootComment(message, username)

    floot.create_comment(comment)

    return comment.to_dictionary()

# POST /api/floots/{floot_id}/comments/{comment_id}/delete
def delete_comment(floot_id, comment_id, request_body):

    if not db.has_floot(floot_id): return HTTPError(404, "floot could not be found")

    if "username" not in request_body:
        return HTTPError(400, "username could not be found")
    username = request_body["username"]

    floot = db.get_floot_by_id(floot_id)
    comments = floot.get_comments()


    target_comment = None
    for comment in comments:
        id = comment.get_id()
        if id == comment_id: target_comment = comment
    if target_comment is None: return HTTPError(404, "comment could not be found")

    if target_comment.get_author() != username: return HTTPError(401, "user deleting is not the same as user who posted floot")
    floot.delete_comment(target_comment, username)
    return "OK"

GET_ROUTES = [
    ("/api/floots", get_floots),
    (("/api/floots/(.*?)/comments", "floot_id"), get_comments),
    (("/api/floots/(.*)", "floot_id"), get_floot),
    (("(/.*)", "path"), serve_file),
]

POST_ROUTES = [
    (("/api/floots"), create_floot),
    (("/api/floots/(.*?)/comments", "floot_id"), create_comment),
    (("/api/floots/(.*?)/comments/(.*)/delete", "floot_id", "comment_id"), delete_comment),
    (("/api/floots/(.*)/delete", "floot_id"), delete_floot)
]

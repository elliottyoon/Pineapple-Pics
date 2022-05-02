from flask import Response, request
from flask_restful import Resource
from models import Bookmark, Post, db
from views import can_view_post 
import json

class BookmarksListEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
    
    def get(self):
        # get all bookmarks owned by the current user
        bookmarks = Bookmark.query.filter_by(user_id=self.current_user.id).all()
        bookmarks_list = [bookmark.to_dict() for bookmark in bookmarks]
        return Response(json.dumps(bookmarks_list), mimetype="application/json", status=200)

    def post(self):
        # create a new "bookmark" based on the data posted in the body 
        body = request.get_json()
        print(body)

        try:
            post_id = int(body.get("post_id"))
        except:
            return Response(json.dumps({"message": "Invalid formatting"}), mimetype="application/json", status=400) 
        post = Post.query.get(post_id)
        if not post:
            return Response(json.dumps({"message": "post not found"}), mimetype="application/json", status=404)  
        bookmark = Bookmark.query.get(post_id)
        if not bookmark:
            # post found
            if can_view_post(post_id, self.current_user):
                bookmark = Bookmark(post.user_id, post_id)
                db.session.add(bookmark)
                db.session.commit()
                return Response(json.dumps(bookmark.to_dict()), mimetype="application/json", status=201)
            return Response(json.dumps({"message": "not authorized to bookmark post"}), mimetype="application/json", status=404)
        return Response(json.dumps({"message": "bookmark already exists"}), mimetype="application/json", status=400) 

class BookmarkDetailEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
    
    def delete(self, id):
        # delete "bookmark" record where "id"=id
        bookmark = Bookmark.query.get(id)
        if not bookmark:
            return Response(json.dumps({"message": "id={0} is invalid".format(id)}), mimetype="application/json", status=404)
        if bookmark.user_id != self.current_user.id:
            return Response(json.dumps({"message": "id={0} is invalid".format(id)}), mimetype="application/json", status=404)
        Bookmark.query.filter_by(id=id).delete()
        db.session.commit()
        return Response(json.dumps({"message": "bookmark was successfully deleted"}), mimetype="application/json", status=200)



def initialize_routes(api):
    api.add_resource(
        BookmarksListEndpoint, 
        '/api/bookmarks', 
        '/api/bookmarks/', 
        resource_class_kwargs={'current_user': api.app.current_user}
    )

    api.add_resource(
        BookmarkDetailEndpoint, 
        '/api/bookmarks/<int:id>', 
        '/api/bookmarks/<int:id>',
        resource_class_kwargs={'current_user': api.app.current_user}
    )

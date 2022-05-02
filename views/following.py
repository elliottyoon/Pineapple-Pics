from flask import Response, request
from flask_restful import Resource
from models import Following, User, db
import json

def get_path():
    return request.host_url + 'api/posts/'

class FollowingListEndpoint(Resource):
    def __init__(self, current_user):
        self.current_user = current_user
    
    def get(self):
        # return all of the "following" records that the current user is following
        following = Following.query.filter(Following.following_id == self.current_user.id).all()
        ret_followers = [follower.to_dict_following() for follower in following]
        return Response(json.dumps(ret_followers), mimetype="application/json", status=200)

    def post(self):
        # create a new "following" record based on the data posted in the body 
        body = request.get_json()
        print(body)
        # formatting
        try:
            id = int(body.get("user_id"))
        except:
            return Response(json.dumps({"message": "Invalid formatting"}), mimetype="application/json", status=400) 

        # make sure user exists
        user = User.query.get(id)
        if not user:
            return Response(json.dumps({"message": "user not found"}), mimetype="application/json", status=404)  

        # check for duplicates
        following = Following.query.filter_by(user_id = self.current_user.id).all()
        for follow in following:
            if follow.following_id == id:
                return Response(json.dumps({"message": "follow already exists"}), mimetype="application/json", status=400) 
        
        new_follow = Following(self.current_user.id, id)
        db.session.add(new_follow)
        db.session.commit()
        return Response(json.dumps(new_follow.to_dict_following()), mimetype="application/json", status=201)
        
             

class FollowingDetailEndpoint(Resource):
    def __init__(self, current_user):
        self.current_user = current_user
    
    def delete(self, id):
        # delete "following" record where "id"=id
        print(id)
        following = Following.query.get(id)
        if not following:
            return Response(json.dumps({"message": "id={0} is invalid".format(id)}), mimetype="application/json", status=404)
        if following.user_id != self.current_user.id:
            return Response(json.dumps({"message": "id={0} is invalid".format(id)}), mimetype="application/json", status=404)
        Following.query.filter_by(id=id).delete()
        db.session.commit()
        return Response(json.dumps({"message": "following object was successfully deleted"}), mimetype="application/json", status=200)




def initialize_routes(api):
    api.add_resource(
        FollowingListEndpoint, 
        '/api/following', 
        '/api/following/', 
        resource_class_kwargs={'current_user': api.app.current_user}
    )
    api.add_resource(
        FollowingDetailEndpoint, 
        '/api/following/<int:id>', 
        '/api/following/<int:id>/', 
        resource_class_kwargs={'current_user': api.app.current_user}
    )

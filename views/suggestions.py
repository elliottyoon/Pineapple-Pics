from flask import Response, request
from flask_restful import Resource
from models import User
from views import get_authorized_user_ids
import json

class SuggestionsListEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
    
    def get(self):
        # suggestions should be any user with an ID that's not in this list:
        # print(get_authorized_user_ids(self.current_user))
        following_ids = get_authorized_user_ids(self.current_user)
        suggestions = User.query.filter(~User.id.in_(following_ids)).limit(7).all()
        suggestions = [suggestion.to_dict() for suggestion in suggestions]
        return Response(json.dumps(suggestions), mimetype="application/json", status=200)


def initialize_routes(api):
    api.add_resource(
        SuggestionsListEndpoint, 
        '/api/suggestions', 
        '/api/suggestions/', 
        resource_class_kwargs={'current_user': api.app.current_user}
    )
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
        known_users = get_authorized_user_ids(self.current_user)
        suggestions = User.query.filter(User.id.not_in(known_users)).limit(7).all()
        suggestions_json = [suggestion.to_dict() for suggestion in suggestions]
        
        return Response(json.dumps(suggestions_json), mimetype="application/json", status=200)


def initialize_routes(api):
    api.add_resource(
        SuggestionsListEndpoint, 
        '/api/suggestions', 
        '/api/suggestions/', 
        resource_class_kwargs={'current_user': api.app.current_user}
    )

# Note to self
# Difference between filter_by and filter is filter_by is for simple queries and doesn't need table names
# while filter needs explicit table names to access columns and needs boolean operators (instead of simple = needs ==)
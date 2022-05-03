from flask import Response, request
from flask_restful import Resource
from models import Bookmark, Following, Post, db
import json

class BookmarksListEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
    
    def get(self):
        # get all bookmarks owned by the current user
        id = self.current_user.id
        bookmarks = Bookmark.query.filter_by(user_id=id).all()
        bookmarks_json = [bookmark.to_dict() for bookmark in bookmarks]

        return Response(json.dumps(bookmarks_json), mimetype="application/json", status=200)

    def post(self):
        # create a new "bookmark" based on the data posted in the body 
        body = request.get_json()
        if not body.get('post_id'):
            return Response(json.dumps({'message': "'post_id' is required"}), mimetype="application/json", status=400)
        
        # Checks to see if bookmark is an int
        try:
            id = int(body.get('post_id'))
        except:
            return Response(json.dumps({'message': "the post_id parameter is invalid"}), mimetype="application/json", status=400)
        
        # Checks if post_id is valid
        if not Post.query.get(id):
            return Response(json.dumps({'message': "the post_id parameter is invalid"}), mimetype="application/json", status=404)

        # Check if user is authorized to bookmark
        if not Following.query.filter_by(user_id=self.current_user.id, following_id=Post.query.get(id).user_id).all():
            return Response(json.dumps({'message': "the post_id parameter is invalid"}), mimetype="application/json", status=404)

        # Checks for dupes
        if Bookmark.query.filter_by(user_id=self.current_user.id, post_id=id).all():
            return Response(json.dumps({'message': "bookmark already exists"}), mimetype="application/json", status=400)

        new_bookmark = Bookmark(
            user_id=self.current_user.id,
            post_id=id
        )

        db.session.add(new_bookmark) 
        db.session.commit()         

        return Response(json.dumps(new_bookmark.to_dict()), mimetype="application/json", status=201)


class BookmarkDetailEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
    
    def delete(self, id):
        # delete "bookmark" record where "id"=id
        bookmark = Bookmark.query.get(id)
        if not bookmark:
            return Response(json.dumps({'message': 'id={0} is invalid'.format(id)}), mimetype="application/json", status=404)

        if bookmark.user_id != self.current_user.id:
            return Response(json.dumps({'message': 'id={0} is invalid'.format(id)}), mimetype="application/json", status=404)

        bookmark.query.filter_by(id=id).delete()
        db.session.commit()

        return Response(json.dumps({'message': 'Following {0} was successfully deleted'.format(id)}), mimetype="application/json", status=200)




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

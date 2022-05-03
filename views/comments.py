from flask import Response, request
from flask_restful import Resource
import json
from models import db, Comment, Following, Post

class CommentListEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
    
    def post(self):
        # create a new "Comment" based on the data posted in the body 
        body = request.get_json()
        if not body.get('post_id'):
            return Response(json.dumps({'message': "'post_id' is required"}), mimetype="application/json", status=400)

        # check if post_id is an int
        try:
            id = int(body.get('post_id'))
        except:
            return Response(json.dumps({'message': "the post_id parameter is invalid"}), mimetype="application/json", status=400)
        
        # check if post_id is valid
        if not Post.query.get(id):
            return Response(json.dumps({'message': "the post_id parameter is invalid"}), mimetype="application/json", status=404)

        # check if comment is empty
        if not body.get('text'):
            return Response(json.dumps({'message': "the comment parameter is empty"}), mimetype="application/json", status=400)

        print("HEWOPEWOIPEWOIPE")
        print(id, Post.query.get(id).user_id)

        # Check if user is authorized to comment
        if not Following.query.filter_by(user_id=self.current_user.id, following_id=Post.query.get(id).user_id).all():
            return Response(json.dumps({'message': "the post_id parameter is invalid"}), mimetype="application/json", status=404)


        new_comment = Comment(
            user_id=self.current_user.id,
            post_id=body.get('post_id'),
            comment=body.get('comment')
        )

        db.session.add(new_comment)
        db.session.commit()

        return Response(json.dumps({}), mimetype="application/json", status=201)
        
class CommentDetailEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
  
    def delete(self, id):
        comment = Comment.query.get(id)

        if not comment:
            return Response(json.dumps({'message': "id is invalid"}), mimetype="application/json", status=404)

        if comment.user_id != self.current_user.id:
            return Response(json.dumps({'message': "id is invalid"}), mimetype="application/json", status=404)

        db.session.delete(comment)
        db.session.commit()

        return Response(json.dumps({}), mimetype="application/json", status=200)


def initialize_routes(api):
    api.add_resource(
        CommentListEndpoint, 
        '/api/comments', 
        '/api/comments/',
        resource_class_kwargs={'current_user': api.app.current_user}

    )
    api.add_resource(
        CommentDetailEndpoint, 
        '/api/comments/<int:id>', 
        '/api/comments/<int:id>/',
        resource_class_kwargs={'current_user': api.app.current_user}
    )

import React, { useState } from "react";
import { useLocation } from "react-router-dom";

const LessonPreviewPage = () => {
    const location = useLocation();
    const { lesson, courseName } = location.state; // Retrieve lesson and courseName from state

    const [comments, setComments] = useState([
        {
            id: 1,
            user: "Alice Johnson",
            text: "Great explanation! Could you provide more examples?",
            replies: [
                { id: 1, user: "Instructor", text: "Sure! I'll include more examples in the next update." }
            ]
        },
        {
            id: 2,
            user: "Bob Smith",
            text: "I have a doubt about the lifecycle methods.",
            replies: []
        }
    ]);

    const [newComment, setNewComment] = useState("");
    const [reply, setReply] = useState("");

    const handleAddComment = () => {
        if (newComment.trim()) {
            setComments([
                ...comments,
                {
                    id: comments.length + 1,
                    user: "You",
                    text: newComment,
                    replies: []
                }
            ]);
            setNewComment("");
        }
    };

    const handleAddReply = (commentId) => {
        if (reply.trim()) {
            setComments(
                comments.map((comment) =>
                    comment.id === commentId
                        ? {
                              ...comment,
                              replies: [
                                  ...comment.replies,
                                  { id: comment.replies.length + 1, user: "Instructor", text: reply }
                              ]
                          }
                        : comment
                )
            );
            setReply("");
        }
    };

    return (
        <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
            <h2 className="text-center text-3xl text-blue-600 font-semibold">{lesson.title}</h2>
            <h4 className="text-center text-xl">Course: {courseName}</h4>
            <div style={{ margin: "20px 0" }}>
            <iframe 
            style={{ width: "100%", height: "430px", borderRadius: "8px" }} 
            src="https://www.youtube.com/embed/X2yYnADRYTw?si=MRDLnmLcmhq4fG9w" 
            title="YouTube video player" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen />
            </div>
            <div>
                <h4 className="text-xl font-semibold">Lesson Stats</h4>
                <p>Views: 1,234</p>
                <p>Likes: 456</p>
                <p>Comments: {comments.length}</p>
            </div>
            <div style={{ marginTop: "30px" }}>
                <h4>Comments</h4>
                <div>
                    {comments.map((comment) => (
                        <div
                            key={comment.id}
                            style={{
                                marginBottom: "20px",
                                padding: "10px",
                                border: "1px solid #ddd",
                                borderRadius: "8px"
                            }}
                        >
                            <strong>{comment.user}:</strong>
                            <p>{comment.text}</p>
                            {comment.replies.map((reply) => (
                                <div
                                    key={reply.id}
                                    style={{
                                        marginLeft: "20px",
                                        marginTop: "10px",
                                        fontSize: "14px"
                                    }}
                                >
                                    <strong>{reply.user}:</strong> {reply.text}
                                </div>
                            ))}
                            <div style={{ marginTop: "10px" }}>
                                <input
                                    type="text"
                                    placeholder="Reply as Instructor..."
                                    value={reply}
                                    onChange={(e) => setReply(e.target.value)}
                                    style={{
                                        padding: "8px",
                                        width: "70%",
                                        marginRight: "10px",
                                        borderRadius: "4px",
                                        border: "1px solid #ddd"
                                    }}
                                />
                                <button
                                    onClick={() => handleAddReply(comment.id)}
                                    style={{
                                        padding: "8px 12px",
                                        borderRadius: "4px",
                                        backgroundColor: "#007BFF",
                                        color: "white",
                                        border: "none"
                                    }}
                                >
                                    Reply
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <div>
                    <h5>Add a Comment:</h5>
                    <textarea
                        rows="3"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "10px",
                            borderRadius: "4px",
                            border: "1px solid #ddd",
                            marginBottom: "10px"
                        }}
                    ></textarea>
                    <button
                        onClick={handleAddComment}
                        style={{
                            padding: "10px 20px",
                            borderRadius: "4px",
                            backgroundColor: "#28a745",
                            color: "white",
                            border: "none"
                        }}
                    >
                        Add Comment
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LessonPreviewPage;

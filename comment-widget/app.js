let commentForm = document.querySelector(".comment-form");
let commentInput = document.querySelector("#comment-input");
let commentList = document.querySelector(".comment-list");
let commentListArr = [];
let widget = document.querySelector("#widget");

// let sampleCommentList = [
//   {
//     id: 1007,
//     comment: "hellow",
//     replies: [
//       {
//         id: "007a",
//         comment: "there",
//         replies: [
//           {
//             id: "007ax",
//             comment: "squid game",
//             replies: [],
//           },
//         ],
//       },
//       {
//         id: "007b",
//         comment: "world",
//         replies: [],
//       },
//     ],
//   },
//   {
//     id: 1008,
//     comment: "new",
//     replies: [],
//   },
// ];

commentForm.addEventListener("submit", (e) =>
  addCommentToList(e, commentInput.value, widget)
);

function addCommentToList(e, commentVal, parentEl) {
  e.preventDefault();

  let commentObj = {};
  let unikey = Math.floor(Math.random() * 10000);
  commentObj.id = `comment-${unikey}`;
  commentObj.comment = commentVal;
  commentObj.replies = [];

  if (parentEl.getAttribute("id") === "widget") {
    commentListArr = [...commentListArr, commentObj];
  } else findCommentAndPush(commentObj, commentListArr, parentEl);

  recurseAndRender(commentListArr, widget);
  e.target.reset();
}

function findCommentAndPush(obj, arr, parentEl) {
  arr &&
    arr.length &&
    arr.forEach((item) => {
      if (item.id === parentEl.getAttribute("id")) {
        item.replies.push(obj);
      } else findCommentAndPush(obj, item.replies, parentEl);
    });
}

function recurseAndRender(commentListArr, parentDomEl) {
  Array.from(parentDomEl.children)[2] &&
    Array.from(parentDomEl.children)[2].remove();

  let newCommentList = document.createElement("ul");
  parentDomEl.appendChild(newCommentList);

  commentListArr.forEach((element) => {
    let newCommentItem = CommentComponent(element);
    newCommentList.appendChild(newCommentItem);

    if (element.replies.length) {
      recurseAndRender(element.replies, newCommentItem);
    }
  });
}

function CommentComponent(commentObj) {
  let commentItem = document.createElement("li");
  commentItem.setAttribute("id", commentObj.id);

  // reply button
  let replyBtn = document.createElement("button");
  replyBtn.id = "reply-btn";
  replyBtn.innerText = "Reply";
  replyBtn.setAttribute("id", commentObj.id);

  let deleteCommentBtn = document.createElement("button");
  deleteCommentBtn.setAttribute("id", "delete-comment");
  deleteCommentBtn.innerText = "Delete";

  replyBtn.addEventListener("click", renderReplyForm);
  deleteCommentBtn.addEventListener("click", deleteComment);

  // appending to the DOM comment list
  commentItem.innerText = commentObj.comment;
  commentItem.appendChild(replyBtn);
  commentItem.appendChild(deleteCommentBtn);
  return commentItem;
}

function renderReplyForm(e) {
  let targetCommentEl = e.target.parentElement;

  let replyForm = document.createElement("form");
  let replyInput = document.createElement("input");
  let replySubmitBtn = document.createElement("button");
  replySubmitBtn.innerText = "post reply";

  replyForm.appendChild(replyInput);
  replyForm.appendChild(replySubmitBtn);
  targetCommentEl.appendChild(replyForm);

  replyForm.addEventListener("submit", (e) => {
    addCommentToList(e, replyInput.value, targetCommentEl);
    replyForm.reset();
    replyForm.remove();
  });
}

function deleteComment(e) {
  function findCommentAndDelete(el, arr) {
    arr &&
      arr.length &&
      arr.forEach((item, index) => {
        if (item.id === el.getAttribute("id")) {
          arr.splice(index, 1);
          recurseAndRender(commentListArr, widget);
        } else findCommentAndDelete(el, item.replies);
      });
  }

  findCommentAndDelete(e.target.parentElement, commentListArr);
}

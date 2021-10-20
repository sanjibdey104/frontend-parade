let commentForm = document.querySelector(".comment-form");
let commentInput = document.querySelector("#comment-input");
let commentBoxInput = document.querySelector("#comment-box-input");
let commentList = document.querySelector(".comment-list");
let widget = document.querySelector("#widget");
let commentsContainer = document.querySelector(".comments-container");
let commentListArr = [];

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
  addCommentToList(e, commentBoxInput.value, widget)
);

function addCommentToList(e, commentVal, parentEl) {
  e.preventDefault();

  let commentObj = generateCommentObj(commentVal);

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

function generateCommentObj(commentVal) {
  let commentObj = {};
  let unikey = Math.floor(Math.random() * 10000);
  commentObj.id = `comment-${unikey}`;
  commentObj.comment = commentVal;
  commentObj.replies = [];
  return commentObj;
}

function recurseAndRender(commentsArr, parentDomEl) {
  if (parentDomEl.getAttribute("id") === "widget") {
    parentDomEl = commentsContainer;
    parentDomEl.innerHTML = "";
  }

  let newCommentList = document.createElement("ul");
  parentDomEl.appendChild(newCommentList);

  commentsArr.forEach((element) => {
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
  replyBtn.innerText = "reply 📣";
  replyBtn.setAttribute("id", commentObj.id);

  let deleteCommentBtn = document.createElement("button");
  deleteCommentBtn.setAttribute("id", "delete-comment");
  deleteCommentBtn.innerText = "delete 🔥";

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
  replyForm.classList.add("reply-form");
  let replyInput = document.createElement("textarea");
  let controls = document.createElement("div");
  controls.classList.add("controls");
  let replySubmitBtn = document.createElement("button");
  replySubmitBtn.innerText = "post reply 🚀";
  let cancelReplyBtn = document.createElement("button");
  cancelReplyBtn.type = "button";
  cancelReplyBtn.innerHTML = "cancel ❌";

  replyForm.appendChild(replyInput);
  controls.appendChild(replySubmitBtn);
  controls.appendChild(cancelReplyBtn);
  replyForm.appendChild(controls);
  targetCommentEl.appendChild(replyForm);

  cancelReplyBtn.addEventListener("click", (e) => {
    e.preventDefault();
    replyForm.remove();
  });

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

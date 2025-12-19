// // import { useEffect } from "react";
// // import { useDispatch, useSelector } from "react-redux";
// // import { socket } from "./socket";


// // import {
// //   addRequest,
// //   addNotification,
// //   addFriend,
// // } from "./friendSlice";

// // export default function SocketListener() {
// //   const dispatch = useDispatch();
// //   const authUser = useSelector((state) => state.auth.user);

// //   useEffect(() => {
// //     if (!authUser?.user?._id) return;

// //     const userId = authUser.user._id;

// //     socket.connect();
// //     socket.emit("register", userId);

// //     // ✅ RECEIVE REQUEST
// //     socket.on("followRequestReceived", (data) => {
// //       dispatch(
// //         addRequest({
// //           id: data.fromId,
// //           _id: data.fromId,
// //           name: data.from,
// //           username: data.from,
// //         })
// //       );

// //       dispatch(
// //         addNotification(`@${data.from} sent you a follow request`)
// //       );
// //     });

// //     // ✅ ACCEPTED
// //     socket.on("followRequestAccepted", (data) => {
// //       dispatch(
// //         addFriend({
// //           id: data.byId,
// //           _id: data.byId,
// //           name: data.by,
// //           username: data.by,
// //         })
// //       );

// //       dispatch(
// //         addNotification(`@${data.by} accepted your follow request`)
// //       );
// //       toast.success(`@${data.by} accepted your request`);
// //     });

// //     // ✅ REJECTED
// //     socket.on("followRequestRejected", (data) => {
// //       dispatch(
// //         addNotification(`@${data.by} rejected your follow request`)
// //       );
// //     });

// //     return () => {
// //       socket.off("followRequestReceived");
// //       socket.off("followRequestAccepted");
// //       socket.off("followRequestRejected");
// //     };
// //   }, [authUser, dispatch]);

// //   return null; // 👈 No UI
// // }


// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { socket } from "./socket";
// import toast from "react-hot-toast";

// import {
//   addRequest,
//   addNotification,
//   addFriend,
// } from "./friendSlice";

// export default function SocketListener() {
//   const dispatch = useDispatch();
//   const authUser = useSelector((state) => state.auth.user);

//   useEffect(() => {
//     if (!authUser?.user?._id) return;

//     const userId = authUser.user._id;

//     // 🔌 CONNECT & REGISTER
//     if (!socket.connected) {
//       socket.connect();
//     }
//     socket.emit("register", userId);

//     // ==============================
//     // 👤 FOLLOW REQUEST RECEIVED
//     // ==============================
//     socket.on("followRequestReceived", (data) => {
//       dispatch(
//         addRequest({
//           id: data.fromId,
//           _id: data.fromId,
//           name: data.from,
//           username: data.from,
//         })
//       );

//       dispatch(
//         addNotification({
//           id: Date.now(),
//           type: "follow_request",
//           message: `@${data.from} sent you a follow request`,
//           fromUser: data.from,
//           createdAt: new Date().toISOString(),
//         })
//       );
//     });

//     // ==============================
//     // ✅ FOLLOW ACCEPTED
//     // ==============================
//     socket.on("followRequestAccepted", (data) => {
//       dispatch(
//         addFriend({
//           id: data.byId,
//           _id: data.byId,
//           name: data.by,
//           username: data.by,
//         })
//       );

//       dispatch(
//         addNotification({
//           id: Date.now(),
//           type: "follow_accept",
//           message: `@${data.by} accepted your follow request`,
//           fromUser: data.by,
//           createdAt: new Date().toISOString(),
//         })
//       );

//       toast.success(`@${data.by} accepted your request`);
//     });

//     // ==============================
//     // ❌ FOLLOW REJECTED
//     // ==============================
//     socket.on("followRequestRejected", (data) => {
//       dispatch(
//         addNotification({
//           id: Date.now(),
//           type: "follow_reject",
//           message: `@${data.by} rejected your follow request`,
//           fromUser: data.by,
//           createdAt: new Date().toISOString(),
//         })
//       );
//     });

//     // ==============================
//     // ❤️ ARTICLE LIKED
//     // ==============================
//     socket.on("articleLiked", (data) => {
//       dispatch(
//         addNotification({
//           id: Date.now(),
//           type: "like",
//           message: `@${data.likedBy} liked your post`,
//           fromUser: data.likedBy,
//           articleId: data.articleId,
//           createdAt: new Date().toISOString(),
//         })
//       );
//     });

//     // ==============================
//     // 💬 NEW COMMENT
//     // ==============================
//     socket.on("newComment", (data) => {
//       dispatch(
//         addNotification({
//           id: Date.now(),
//           type: "comment",
//           message: `@${data.comment.by} commented: "${data.comment.text}"`,
//           fromUser: data.comment.by,
//           articleId: data.articleId,
//           createdAt: new Date().toISOString(),
//         })
//       );
//     });

//     // ==============================
//     // 🧹 CLEANUP
//     // ==============================
//     return () => {
//       socket.off("followRequestReceived");
//       socket.off("followRequestAccepted");
//       socket.off("followRequestRejected");
//       socket.off("articleLiked");
//       socket.off("newComment");
//     };
//   }, [authUser, dispatch]);

//   return null; // 👈 no UI
// }


import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { socket } from "./socket";
import toast from "react-hot-toast";

import {
  addRequest,
  addNotification,
  addFriend,
} from "./friendSlice";

export default function SocketListener() {
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (!authUser?.user?._id) return;

    const userId = authUser.user._id;

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("register", userId);

    /* ================= FOLLOW REQUEST ================= */
    socket.on("followRequestReceived", (data) => {
      dispatch(
        addRequest({
          id: data.fromId,
          _id: data.fromId,
          name: data.from,
          username: data.from,
        })
      );

      dispatch(
        addNotification({
          msg: `👤 @${data.from} sent you a follow request`,
          time: Date.now(),
        })
      );
    });

    /* ================= FOLLOW ACCEPTED ================= */
    socket.on("followRequestAccepted", (data) => {
      dispatch(
        addFriend({
          id: data.byId,
          _id: data.byId,
          name: data.by,
          username: data.by,
        })
      );

      dispatch(
        addNotification({
          msg: `✅ @${data.by} accepted your follow request`,
          time: Date.now(),
        })
      );

      toast.success(`@${data.by} accepted your request`);
    });

    /* ================= FOLLOW REJECTED ================= */
    socket.on("followRequestRejected", (data) => {
      dispatch(
        addNotification({
          msg: `❌ @${data.by} rejected your follow request`,
          time: Date.now(),
        })
      );
    });

    /* ================= ❤️ LIKE ================= */
    socket.on("articleLiked", (data) => {
      dispatch(
        addNotification({
          msg: `❤️ @${data.likedBy} liked your post`,
          time: Date.now(),
        })
      );
    });

    /* ================= 💬 COMMENT ================= */
    socket.on("newComment", (data) => {
      dispatch(
        addNotification({
          msg: `💬 @${data.comment.by} commented: "${data.comment.text}"`,
          time: Date.now(),
        })
      );
    });

    return () => {
      socket.off("followRequestReceived");
      socket.off("followRequestAccepted");
      socket.off("followRequestRejected");
      socket.off("articleLiked");
      socket.off("newComment");
    };
  }, [authUser, dispatch]);

  return null;
}


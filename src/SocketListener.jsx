


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


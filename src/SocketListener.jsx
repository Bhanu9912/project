import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { socket } from "./socket";


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

    socket.connect();
    socket.emit("register", userId);

    // ✅ RECEIVE REQUEST
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
        addNotification(`@${data.from} sent you a follow request`)
      );
    });

    // ✅ ACCEPTED
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
        addNotification(`@${data.by} accepted your follow request`)
      );
      toast.success(`@${data.by} accepted your request`);
    });

    // ✅ REJECTED
    socket.on("followRequestRejected", (data) => {
      dispatch(
        addNotification(`@${data.by} rejected your follow request`)
      );
    });

    return () => {
      socket.off("followRequestReceived");
      socket.off("followRequestAccepted");
      socket.off("followRequestRejected");
    };
  }, [authUser, dispatch]);

  return null; // 👈 No UI
}

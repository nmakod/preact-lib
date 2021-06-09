import { Fragment, FunctionComponent, h } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";
import { styled, setup, css } from "goober";
import { forwardRef } from "preact/compat";
import AgoraRTC from "agora-rtc-sdk-ng";

setup(h);

const Title = styled(`h3`)`
  color: blue;
`;

const Header = styled("div")`
  color: green;
`;

const PlayerContainer = css`
  min-height: 600px;
  width: 360px;
  border: 1px solid #ccc;
`;

interface RTC {
  localAudioTrack: any;
  localVideoTrack: any;
  client: any;
}
let rtc: RTC = {
  localAudioTrack: null,
  localVideoTrack: null,
  client: null,
};

let options = {
  // Pass your App ID here.
  appId: "Your App ID",
  // Set the channel name.
  channel: "rymIqKIQfI",
  // Pass your temp token here.
  token:
    "0060b6f87fbf33e499fa4ac29aec04493acIABqO3rfPfADlzamUMmdDlRXgyy7RA9H1sbOplop8tTQ9YQc048AAAAAIgCEIB5KCebBYAQAAQApIcFgAgApIcFgAwApIcFgBAApIcFg",
  // Set the user ID.
  uid: 123456,
};

const PollContainer: FunctionComponent = styled("div", forwardRef)``;

const PreactLibWithHook = () => {
  const [title] = useState("My awesome video component 📺");

  async function startBasicCall() {
    // Create an AgoraRTCClient object.

    rtc.client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

    const uid = await rtc.client.join(
      options.appId,
      options.channel,
      options.token,
      null
    );

    // Listen for the "user-published" event, from which you can get an AgoraRTCRemoteUser object.
    rtc.client.on("user-published", async (user: any, mediaType: any) => {
      // Subscribe to the remote user when the SDK triggers the "user-published" event
      await rtc.client.subscribe(user, mediaType);
      console.log("subscribe success");

      // If the remote user publishes a video track.
      if (mediaType === "video") {
        // Get the RemoteVideoTrack object in the AgoraRTCRemoteUser object.
        const remoteVideoTrack = user.videoTrack;
        // Dynamically create a container in the form of a DIV element for playing the remote video track.
        const remotePlayerContainer = document.createElement("div");
        // Specify the ID of the DIV container. You can use the uid of the remote user.
        remotePlayerContainer.id = user.uid.toString();
        remotePlayerContainer.textContent =
          "Remote user " + user.uid.toString();
        remotePlayerContainer.style.width = "640px";
        remotePlayerContainer.style.height = "480px";
        const container = document.getElementById("video-container");
        container.append(remotePlayerContainer);

        // Play the remote video track.
        // Pass the DIV container and the SDK dynamically creates a player in the container for playing the remote video track.
        remoteVideoTrack.play(remotePlayerContainer);

        // Or just pass the ID of the DIV container.
        // remoteVideoTrack.play(playerContainer.id);
      }

      // If the remote user publishes an audio track.
      if (mediaType === "audio") {
        // Get the RemoteAudioTrack object in the AgoraRTCRemoteUser object.
        const remoteAudioTrack = user.audioTrack;
        // Play the remote audio track. No need to pass any DOM element.
        remoteAudioTrack.play();
      }

      // Listen for the "user-unpublished" event
      rtc.client.on("user-unpublished", (user: any) => {
        // Get the dynamically created DIV container.
        const remotePlayerContainer = document.getElementById(user.uid);
        // Destroy the container.
        remotePlayerContainer.remove();
      });
    });
  }
  useEffect(() => {
    startBasicCall();
  }, []);
  return (
    <Fragment>
      <Title>{title}</Title>
      <div id="video-container" className={PlayerContainer}></div>
    </Fragment>
  );
};

export { PreactLibWithHook };

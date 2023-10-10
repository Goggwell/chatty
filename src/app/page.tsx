export const runtime = "edge";
import Chat from "./components/chat";

export default function Home() {
  return (
    <div className="h-full w-full p-8 flex">
      <Chat />
    </div>
  );
}

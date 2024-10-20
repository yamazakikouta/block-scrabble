import Image from "next/image";
import { Game } from "@/components/game";

export default function Home() {
	return (
	  <div className="grid grid-rows-[520px_1fr_20px] items-center justify-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
		<div className="flex flex-col items-center justify-center">
			<Game />
		</div>
	  </div>
	);
  }

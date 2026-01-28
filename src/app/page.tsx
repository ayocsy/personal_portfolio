"use client";

import React, {useRef, useState} from "react";
import Desktop from "@/components/Desktop";
import Bootscreen from "@/components/Bootscreen";


export default function Home() {

  const desktopRef = useRef<HTMLDivElement>(null);

  const [mode, setMode] = useState<"boot" | "desktop">("boot");

  if (mode === "boot") {
    return <Bootscreen onFinish={() => setMode("desktop")} />;
    // when bootscreen finishes, call back and switch to desktop mode
  } else {
    return <Desktop reboot={() => setMode("boot")}/>;
  }
  // return <Desktop reboot={() => setMode("boot")}/>;

}

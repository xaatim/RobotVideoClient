import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from "lucide-react";

export function Controls({ toggleState }: { toggleState: boolean }) {
  const [activeKey, setActiveKey] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (
        [
          "w",
          "a",
          "s",
          "d",
          "arrowup",
          "arrowdown",
          "arrowleft",
          "arrowright",
        ].includes(key)
      ) {
        e.preventDefault();
        setActiveKey(key);
        toast.success(activeKey);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (
        [
          "w",
          "a",
          "s",
          "d",
          "arrowup",
          "arrowdown",
          "arrowleft",
          "arrowright",
        ].includes(key)
      ) {
        setActiveKey(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const isActive = (keys: string[]) => keys.includes(activeKey || "");

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div className={`${!toggleState && "cursor-not-allowed"} `}>
        <Button
          disabled={!toggleState}
          variant={isActive(["w", "arrowup"]) ? "default" : "outline"}
          size="lg"
          className={`h-12 w-12 p-0 ${!toggleState && "cusor-a"}`}
        >
          <ChevronUp className="h-6 w-6" />
        </Button>
      </div>
      <div
        className={`flex gap-3 items-center ${
          !toggleState && "cursor-not-allowed"
        }`}
      >
        <Button
          disabled={!toggleState}
          variant={isActive(["a", "arrowleft"]) ? "default" : "outline"}
          size="lg"
          className="h-12 w-12 p-0"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button
          disabled={!toggleState}
          variant={isActive(["s", "arrowdown"]) ? "default" : "outline"}
          size="lg"
          className="h-12 w-12 p-0"
        >
          <ChevronDown className="h-6 w-6" />
        </Button>
        <Button
          disabled={!toggleState}
          variant={isActive(["d", "arrowright"]) ? "default" : "outline"}
          size="lg"
          className="h-12 w-12 p-0"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}


// <div className="space-y-4">
//                     {/* Directional Controls */}
//                     <div className="flex flex-col items-center gap-2">
//                       <Button
//                         size="lg"
//                         variant="outline"
//                         className={`w-16 h-16 bg-transparent ${
//                           pressedKeys.has("w")
//                             ? "bg-primary text-primary-foreground"
//                             : ""
//                         }`}
//                         onMouseDown={() => handleDirectionalControl("forward")}
//                       >
//                         <ArrowUp className="w-6 h-6" />
//                       </Button>
//                       <div className="flex gap-2">
//                         <Button
//                           size="lg"
//                           variant="outline"
//                           className={`w-16 h-16 bg-transparent ${
//                             pressedKeys.has("a")
//                               ? "bg-primary text-primary-foreground"
//                               : ""
//                           }`}
//                           onMouseDown={() => handleDirectionalControl("left")}
//                         >
//                           <ArrowLeft className="w-6 h-6" />
//                         </Button>
//                         <Button
//                           size="lg"
//                           variant="outline"
//                           className={`w-16 h-16 bg-transparent ${
//                             pressedKeys.has("s")
//                               ? "bg-primary text-primary-foreground"
//                               : ""
//                           }`}
//                           onMouseDown={() =>
//                             handleDirectionalControl("backward")
//                           }
//                         >
//                           <ArrowDown className="w-6 h-6" />
//                         </Button>
//                         <Button
//                           size="lg"
//                           variant="outline"
//                           className={`w-16 h-16 bg-transparent ${
//                             pressedKeys.has("d")
//                               ? "bg-primary text-primary-foreground"
//                               : ""
//                           }`}
//                           onMouseDown={() => handleDirectionalControl("right")}
//                         >
//                           <ArrowRight className="w-6 h-6" />
//                         </Button>
//                       </div>
//                     </div>

//                     {/* Additional Controls */}
//                     <div className="flex justify-center gap-3">
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         className="bg-transparent"
//                       >
//                         <RotateCcw className="w-4 h-4 mr-2" />
//                         Rotate Left
//                       </Button>
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         className="bg-transparent"
//                       >
//                         <RotateCw className="w-4 h-4 mr-2" />
//                         Rotate Right
//                       </Button>
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         className="bg-transparent"
//                       >
//                         <Pause className="w-4 h-4 mr-2" />
//                         Stop
//                       </Button>
//                     </div>

//                     <div className="text-center text-sm text-muted-foreground">
//                       Press W/A/S/D keys for keyboard control
//                     </div>
//                   </div>
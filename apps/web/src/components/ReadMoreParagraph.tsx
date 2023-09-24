"use client";
import React, { useState, useRef, useEffect } from "react";

function TruncatedParagraph({ text }: { text: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const [maxHeight, setMaxHeight] = useState("10rem");

  const textRef = useRef(null);

  useEffect(() => {
    if (textRef.current.scrollHeight > textRef.current.offsetHeight) {
      setShowReadMore(true);
    }
  }, []);

  const toggleExpanded = () => {
    if (!isExpanded) {
      // Expand the paragraph
      setMaxHeight(`${textRef.current.scrollHeight}px`);
    } else {
      // Collapse the paragraph
      setMaxHeight("10rem");
    }
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="relative">
      <div
        ref={textRef}
        style={{ maxHeight }}
        className={`overflow-hidden transition-all duration-500 ease-in-out relative`}
      >
        <p className="mb-4">{text}</p>
        {showReadMore && !isExpanded && (
          <div className="absolute bottom-0 left-0 w-full h-6 bg-gradient-to-t from-bg-foreground to-transparent pointer-events-none"></div>
        )}
        {showReadMore && (
          <button
            onClick={toggleExpanded}
            className="absolute bottom-0 right-0 text-blue-500 bg-background px-2"
          >
            {isExpanded ? "Collapse" : "Read more"}
          </button>
        )}
      </div>
    </div>
  );
}

export default TruncatedParagraph;

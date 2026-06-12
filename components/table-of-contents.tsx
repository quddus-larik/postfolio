"use client";

import { useActiveHeading } from "postfolio/client";
import { Accordion, ListBox } from "@heroui/react";

export function TableOfContents({
  toc,
}: {
  toc: { text: string; slug: string; level?: number }[];
}) {
  const activeId = useActiveHeading();

  return (
    <Accordion className="w-full" variant="surface">
      <Accordion.Item id="toc">
        <Accordion.Heading>
          <Accordion.Trigger className="text-sm font-semibold">
            Table of Contents
            <Accordion.Indicator />
          </Accordion.Trigger>
        </Accordion.Heading>
        <Accordion.Panel>
          <Accordion.Body className="p-2 pt-0 overflow-y-auto scrollbar-hide">
            <ListBox
              aria-label="Table of Contents"
              className="p-0 gap-0 w-full"
            >
              {toc.map((itm) => {
                const indent =
                  itm.level === 1
                    ? "pl-2"
                    : itm.level === 2
                    ? "pl-6"
                    : itm.level === 3
                    ? "pl-10"
                    : "pl-12";

                const isActive = activeId === itm.slug;

                return (
                  <ListBox.Item
                    key={itm.slug}
                    id={itm.slug}
                    href={`#${itm.slug}`}
                    aria-label={itm.text}
                    textValue={itm.text}
                    className={`text-sm py-1.5 ${indent} ${
                      isActive
                        ? "font-bold text-foreground bg-default-100"
                        : "text-default-500 hover:text-foreground"
                    }`}
                  >
                    {itm.text}
                  </ListBox.Item>
                );
              })}
            </ListBox>
          </Accordion.Body>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}

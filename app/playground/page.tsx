"use client";

import { useState } from "react";
import Disclosure from "./components/Disclosure";
import Tabs from "./components/Tabs";
import Modal from "./components/Modal";

export default function PlaygroundPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <h1 className="text-xl font-bold">Component Playground</h1>

      <section>
        <h2 className="font-semibold mb-2">Disclosure</h2>
        <Disclosure summary="What is this project about?">
          <p>This is a hand-built accessible disclosure component following the ARIA pattern.</p>
        </Disclosure>
      </section>

      <section>
        <h2 className="font-semibold mb-2">Tabs</h2>
        <Tabs />
      </section>

      <section>
        <h2 className="font-semibold mb-2">Modal</h2>
        <button onClick={() => setIsModalOpen(true)}>Open Modal</button>
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Example Modal"
        >
          <p>This is a hand-built accessible modal following the ARIA dialog pattern.</p>
        </Modal>
      </section>
    </div>
  );
}
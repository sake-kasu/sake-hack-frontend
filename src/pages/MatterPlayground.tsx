import { useEffect, useRef } from "react";
import Matter from "matter-js";

export const MatterPlayground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint } = Matter;

    const engine = Engine.create();
    const world = engine.world;

    const render = Render.create({
      canvas,
      engine,
      options: {
        width: 800,
        height: 600,
        wireframes: false,
        background: "#1a1a2e",
      },
    });

    // 地面・壁
    const ground = Bodies.rectangle(400, 620, 810, 60, {
      isStatic: true,
      render: { fillStyle: "#16213e" },
    });
    const wallLeft = Bodies.rectangle(-30, 300, 60, 600, {
      isStatic: true,
      render: { fillStyle: "#16213e" },
    });
    const wallRight = Bodies.rectangle(830, 300, 60, 600, {
      isStatic: true,
      render: { fillStyle: "#16213e" },
    });

    // ランダムな円と四角形を追加
    const bodies = Array.from({ length: 20 }, (_, i) => {
      const x = 100 + (i % 7) * 100;
      const y = 50 + Math.floor(i / 7) * 80;
      const isCircle = i % 2 === 0;
      const color = `hsl(${(i * 30) % 360}, 70%, 60%)`;

      return isCircle
        ? Bodies.circle(x, y, 25, { render: { fillStyle: color } })
        : Bodies.rectangle(x, y, 50, 50, { render: { fillStyle: color } });
    });

    Composite.add(world, [ground, wallLeft, wallRight, ...bodies]);

    // マウス操作
    const mouse = Mouse.create(canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false },
      },
    });
    Composite.add(world, mouseConstraint);
    render.mouse = mouse;

    Render.run(render);
    const runner = Runner.create();
    Runner.run(runner, engine);

    return () => {
      Render.stop(render);
      Runner.stop(runner);
      Engine.clear(engine);
    };
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "24px",
        gap: "16px",
      }}
    >
      <h1 style={{ color: "#e94560", margin: 0 }}>Matter.js Playground</h1>
      <p style={{ color: "#aaa", margin: 0 }}>
        オブジェクトをドラッグして動かせます
      </p>
      <canvas
        ref={canvasRef}
        style={{ borderRadius: "8px", boxShadow: "0 4px 20px rgba(0,0,0,0.5)" }}
      />
    </div>
  );
};

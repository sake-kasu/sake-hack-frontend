import {
  Bodies,
  Body,
  Composite,
  Engine,
  Events,
  Mouse,
  MouseConstraint,
  Render,
  Runner,
} from "matter-js";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

// AppLayout の Toolbar スペーサー(64px) + padding top/bottom(48px)
const APP_OFFSET_HEIGHT = 112;

const CHARACTER_EXPRESSIONS = [
  "/characters/JapaneseSake/normal.png",
  "/characters/JapaneseSake/drinking.png",
  "/characters/JapaneseSake/drunk.png",
] as const;
const CHARACTER_IMAGE_SIZE = 1024; // 実際の画像サイズ (px)
const CHARACTER_DISPLAY_SIZE = 150; // キャンバス上での表示サイズ (px)
const CHARACTER_SPRITE_SCALE = CHARACTER_DISPLAY_SIZE / CHARACTER_IMAGE_SIZE;

export const MatterPlayground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasWrapperRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState<{
    width: number;
    height: number;
  } | null>(null);

  useLayoutEffect(() => {
    const wrapper = canvasWrapperRef.current;
    if (!wrapper) return;
    setCanvasSize({
      width: wrapper.clientWidth,
      height: wrapper.clientHeight,
    });
  }, []);

  useEffect(() => {
    if (!canvasSize) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { width, height } = canvasSize;

    // 重力を弱めにする
    const engine = Engine.create({ gravity: { x: 0, y: 0.3 } });
    const world = engine.world;

    const render = Render.create({
      canvas,
      engine,
      options: {
        width,
        height,
        wireframes: false,
        background: "#1a1a2e",
      },
    });

    // 地面・壁
    const ground = Bodies.rectangle(width / 2, height + 20, width + 20, 60, {
      isStatic: true,
      render: { fillStyle: "#16213e" },
    });
    const wallLeft = Bodies.rectangle(-30, height / 2, 60, height, {
      isStatic: true,
      render: { fillStyle: "#16213e" },
    });
    const wallRight = Bodies.rectangle(width + 30, height / 2, 60, height, {
      isStatic: true,
      render: { fillStyle: "#16213e" },
    });

    // キャラクター剛体（スプライト付き）
    const character = Bodies.rectangle(
      width / 2,
      height / 2,
      CHARACTER_DISPLAY_SIZE,
      CHARACTER_DISPLAY_SIZE,
      {
        restitution: 0.5, // 跳ね返り係数
        frictionAir: 0.05, // 空気抵抗（自然な減衰）
        render: {
          sprite: {
            texture: CHARACTER_EXPRESSIONS[0],
            xScale: CHARACTER_SPRITE_SCALE,
            yScale: CHARACTER_SPRITE_SCALE,
          },
        },
      }
    );

    Composite.add(world, [ground, wallLeft, wallRight, character]);

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

    // ふわふわ上下揺れ（周期的な微小な力）
    let tick = 0;
    Events.on(engine, "beforeUpdate", () => {
      tick++;
      const floatForce = Math.sin(tick * 0.04) * 0.0008;
      Body.applyForce(character, character.position, { x: 0, y: floatForce });
    });

    // クリックで表情を切り替えて跳ねる
    let expressionIndex = 0;
    Events.on(mouseConstraint, "mousedown", () => {
      const dx = character.position.x - mouse.position.x;
      const dy = character.position.y - mouse.position.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < CHARACTER_DISPLAY_SIZE) {
        expressionIndex = (expressionIndex + 1) % CHARACTER_EXPRESSIONS.length;
        const sprite = character.render.sprite;
        if (sprite) {
          sprite.texture = CHARACTER_EXPRESSIONS[expressionIndex];
        }
        Body.applyForce(character, character.position, {
          x: dx * 0.001,
          y: -0.02,
        });
      }
    });

    Render.run(render);
    const runner = Runner.create();
    Runner.run(runner, engine);

    return () => {
      Events.off(engine, "beforeUpdate");
      Render.stop(render);
      Runner.stop(runner);
      Engine.clear(engine);
    };
  }, [canvasSize]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "24px",
        gap: "16px",
        height: `calc(100vh - ${APP_OFFSET_HEIGHT}px)`,
      }}
    >
      <h1 style={{ color: "#e94560", margin: 0 }}>Matter.js Playground</h1>
      <p style={{ color: "#aaa", margin: 0 }}>
        キャラクターをクリック・ドラッグで動かせます
      </p>
      <div
        ref={canvasWrapperRef}
        style={{ flex: 1, width: "100%", display: "flex", justifyContent: "center" }}
      >
        {canvasSize !== null && (
          <canvas
            ref={canvasRef}
            style={{ borderRadius: "8px", boxShadow: "0 4px 20px rgba(0,0,0,0.5)" }}
          />
        )}
      </div>
    </div>
  );
};

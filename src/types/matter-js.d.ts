declare module 'matter-js' {
  export type Engine = unknown;
  export type World = unknown;
  export type Bodies = unknown;
  export type Body = unknown;
  export type Events = unknown;
  export type Composite = unknown;
  export type Constraint = unknown;
  export type Render = unknown;
  export type Runner = unknown;
  export type Mouse = unknown;
  export type MouseConstraint = unknown;

  const Matter: {
    Engine: Engine;
    World: World;
    Bodies: Bodies;
    Body: Body;
    Events: Events;
    Composite: Composite;
    Constraint: Constraint;
    Render: Render;
    Runner: Runner;
    Mouse: Mouse;
    MouseConstraint: MouseConstraint;
  };

  export default Matter;
  export {
    Engine,
    World,
    Bodies,
    Body,
    Events,
    Composite,
    Constraint,
    Render,
    Runner,
    Mouse,
    MouseConstraint,
  };
}

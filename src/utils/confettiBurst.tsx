type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
  rotation: number;
  rotationSpeed: number;
};

class Confetti2D {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private particles: Particle[] = [];
  private rafId: number | null = null;
  private initialized = false;

  init() {
    if (this.initialized) return;

    this.canvas = document.createElement('canvas');
    this.canvas.id = 'confetti-canvas';

    Object.assign(this.canvas.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: '999',
    });

    document.body.appendChild(this.canvas);

    this.ctx = this.canvas.getContext('2d');
    if (!this.ctx) {
      this.destroy();
      return;
    }

    this.resize();
    window.addEventListener('resize', this.resize);

    this.update = this.update.bind(this);
    this.update();

    this.initialized = true;
  }

  private resize = () => {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  };

  spawn(
    count = 100,
    origin: { x: number; y: number } = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    }
  ) {
    if (!this.initialized) {
      console.warn('Confetti2D.spawn() called before init()');
      return;
    }

    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: origin.x,
        y: origin.y,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 1) * 6,
        size: Math.random() * 6 + 4,
        color: `hsl(${Math.random() * 360}, 100%, 60%)`,
        life: 100 + Math.random() * 50,
        rotation: Math.random() * Math.PI,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
      });
    }
  }

  private update() {
    if (!this.ctx || !this.canvas) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];

      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.1;
      p.life--;
      p.rotation += p.rotationSpeed;

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(p.rotation);
      this.ctx.fillStyle = p.color;
      this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      this.ctx.restore();

      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }

    this.rafId = requestAnimationFrame(this.update);
  }

  destroy() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.rafId = null;

    window.removeEventListener('resize', this.resize);

    if (this.canvas?.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }

    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.initialized = false;
  }
}

export const confetti2D = new Confetti2D();
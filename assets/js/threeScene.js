// ==========================================================================
// threeScene.js
// Cinematic Three.js background: golden particles, glass corporate icons,
// abstract rings, light rays, depth fog, mouse parallax, scroll-linked camera.
//
// Signature element: "The Ledger Ring" — three ascending gold bars orbiting
// inside a torus, a direct 3D translation of the Ordinora logo mark.
//
// Loaded as a plain script (no bundler required). Depends on the global
// THREE object from the CDN <script> tag loaded before this file.
// ==========================================================================

(function () {
  const BRAND = {
    ink: 0x003333,
    inkDeep: 0x001d1d,
    gold: 0xca9731,
    goldLight: 0xe5cb98,
    paper: 0xfbfaf7
  };

  class ThreeScene {
    constructor(canvas, opts = {}) {
      this.canvas = canvas;
      this.mode = opts.mode || 'ambient';
      this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
      this.scrollProgress = 0;
      this.clock = new THREE.Clock();

      this._initRenderer();
      this._initScene();
      this._initLights();
      this._initParticles();
      this._initRings();
      this._initGlassIcons();
      if (this.mode === 'hero') this._initLedgerRing();

      this._bindEvents();
      this._resize();
      if (!this.reducedMotion) this._animate();
      else this._renderStatic();
    }

    _initRenderer() {
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.renderer.setClearColor(0x000000, 0);
    }

    _initScene() {
      this.scene = new THREE.Scene();
      this.scene.fog = new THREE.FogExp2(BRAND.inkDeep, 0.045);
      this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
      this.camera.position.set(0, 0, 14);
      this.cameraBase = this.camera.position.clone();
    }

    _initLights() {
      const ambient = new THREE.AmbientLight(BRAND.paper, 0.5);
      this.scene.add(ambient);

      const key = new THREE.DirectionalLight(BRAND.goldLight, 1.1);
      key.position.set(5, 6, 8);
      this.scene.add(key);

      const rim = new THREE.PointLight(BRAND.gold, 2.2, 30, 2);
      rim.position.set(-6, -2, 4);
      this.scene.add(rim);
      this.rimLight = rim;

      this.rays = new THREE.Group();
      const rayGeo = new THREE.PlaneGeometry(0.06, 16);
      const rayMat = new THREE.MeshBasicMaterial({
        color: BRAND.goldLight,
        transparent: true,
        opacity: 0.05,
        side: THREE.DoubleSide
      });
      for (let i = 0; i < 6; i++) {
        const ray = new THREE.Mesh(rayGeo, rayMat.clone());
        ray.position.set((Math.random() - 0.5) * 18, 0, -6 - Math.random() * 6);
        ray.rotation.z = Math.random() * Math.PI;
        ray.userData.speed = 0.05 + Math.random() * 0.08;
        this.rays.add(ray);
      }
      this.scene.add(this.rays);
    }

    _initParticles() {
      const count = this.mode === 'hero' ? 900 : 420;
      const geo = new THREE.BufferGeometry();
      const positions = new Float32Array(count * 3);
      const scales = new Float32Array(count);

      for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 30;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 24 - 4;
        scales[i] = Math.random();
      }
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geo.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));

      const mat = new THREE.PointsMaterial({
        color: BRAND.goldLight,
        size: 0.05,
        transparent: true,
        opacity: 0.75,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      });

      this.particles = new THREE.Points(geo, mat);
      this.scene.add(this.particles);
    }

    _initRings() {
      this.ringGroup = new THREE.Group();
      const ringMat = new THREE.MeshStandardMaterial({
        color: BRAND.gold,
        metalness: 0.85,
        roughness: 0.25,
        emissive: BRAND.gold,
        emissiveIntensity: 0.08
      });

      const radii = [3.6, 5.2, 6.8];
      radii.forEach((r, i) => {
        const geo = new THREE.TorusGeometry(r, 0.015 + i * 0.005, 16, 100);
        const ring = new THREE.Mesh(geo, ringMat);
        ring.rotation.x = Math.PI / 2 + i * 0.3;
        ring.rotation.y = i * 0.5;
        ring.userData.rotSpeed = 0.02 + i * 0.01;
        ring.position.z = -2 - i * 1.5;
        this.ringGroup.add(ring);
      });
      this.ringGroup.position.x = this.mode === 'hero' ? 3.2 : 0;
      this.scene.add(this.ringGroup);
    }

    _initGlassIcons() {
      this.icons = new THREE.Group();

      const glassMat = new THREE.MeshPhysicalMaterial({
        color: BRAND.paper,
        transparent: true,
        opacity: 0.14,
        roughness: 0.15,
        metalness: 0.05,
        transmission: 0.6,
        thickness: 0.4,
        clearcoat: 1,
        side: THREE.DoubleSide
      });
      const goldMat = new THREE.MeshStandardMaterial({
        color: BRAND.gold,
        metalness: 0.9,
        roughness: 0.3,
        emissive: BRAND.gold,
        emissiveIntensity: 0.1
      });

      for (let i = 0; i < 5; i++) {
        const doc = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 1.5), glassMat);
        doc.position.set((Math.random() - 0.5) * 12, (Math.random() - 0.5) * 8, -3 - Math.random() * 5);
        doc.rotation.set(Math.random() * 0.3, Math.random() * 0.6, Math.random() * 0.2);
        doc.userData.float = { speed: 0.3 + Math.random() * 0.4, offset: Math.random() * 10 };
        this.icons.add(doc);
      }

      for (let i = 0; i < 4; i++) {
        const cube = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.4), goldMat);
        cube.position.set((Math.random() - 0.5) * 14, (Math.random() - 0.5) * 9, -2 - Math.random() * 6);
        cube.userData.float = { speed: 0.4 + Math.random() * 0.3, offset: Math.random() * 10 };
        cube.userData.spin = 0.2 + Math.random() * 0.3;
        this.icons.add(cube);
      }

      for (let i = 0; i < 3; i++) {
        const group = new THREE.Group();
        [0.4, 0.7, 1.0].forEach((h, idx) => {
          const bar = new THREE.Mesh(new THREE.BoxGeometry(0.18, h, 0.18), idx === 2 ? goldMat : glassMat);
          bar.position.set(idx * 0.26, h / 2, 0);
          group.add(bar);
        });
        group.position.set((Math.random() - 0.5) * 12, (Math.random() - 0.5) * 7, -4 - Math.random() * 4);
        group.userData.float = { speed: 0.25 + Math.random() * 0.3, offset: Math.random() * 10 };
        this.icons.add(group);
      }

      this.scene.add(this.icons);
    }

    _initLedgerRing() {
      this.ledger = new THREE.Group();

      const ringGeo = new THREE.TorusGeometry(2.1, 0.06, 32, 120);
      const ringMat = new THREE.MeshStandardMaterial({
        color: BRAND.ink,
        emissive: BRAND.gold,
        emissiveIntensity: 0.35,
        metalness: 0.7,
        roughness: 0.2
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      this.ledger.add(ring);

      const barMat = new THREE.MeshStandardMaterial({
        color: BRAND.gold,
        metalness: 0.9,
        roughness: 0.25,
        emissive: BRAND.gold,
        emissiveIntensity: 0.25
      });
      const heights = [0.9, 1.35, 1.8];
      heights.forEach((h, i) => {
        const bar = new THREE.Mesh(new THREE.BoxGeometry(0.34, h, 0.34), barMat);
        bar.position.set((i - 1) * 0.55, h / 2 - 0.9, 0);
        this.ledger.add(bar);
      });

      this.ledger.position.set(-2.6, 0.4, -1);
      this.ledger.scale.setScalar(1.15);
      this.scene.add(this.ledger);
    }

    _bindEvents() {
      window.addEventListener('resize', () => this._resize());
      window.addEventListener('mousemove', (e) => {
        this.mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
        this.mouse.targetY = (e.clientY / window.innerHeight - 0.5) * 2;
      });
    }

    _resize() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      this.renderer.setSize(width, height, false);
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    }

    setScrollProgress(p) {
      this.scrollProgress = p;
    }

    _renderStatic() {
      this.renderer.render(this.scene, this.camera);
    }

    _animate() {
      this._raf = requestAnimationFrame(() => this._animate());
      const t = this.clock.getElapsedTime();

      this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.04;
      this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.04;

      this.camera.position.x = this.cameraBase.x + this.mouse.x * 0.6 - this.scrollProgress * 1.2;
      this.camera.position.y = this.cameraBase.y - this.mouse.y * 0.4 + this.scrollProgress * 0.6;
      this.camera.position.z = this.cameraBase.z - this.scrollProgress * 4;
      this.camera.lookAt(0, 0, -this.scrollProgress * 2);

      this.particles.rotation.y = t * 0.015;
      this.particles.rotation.x = t * 0.008;

      this.ringGroup.children.forEach((ring) => {
        ring.rotation.z += ring.userData.rotSpeed * 0.01;
      });
      this.ringGroup.rotation.y = t * 0.02;

      this.icons.children.forEach((icon) => {
        const f = icon.userData.float;
        if (f) icon.position.y += Math.sin(t * f.speed + f.offset) * 0.0025;
        if (icon.userData.spin) icon.rotation.y += icon.userData.spin * 0.01;
        icon.rotation.x += 0.0006;
      });

      this.rays.children.forEach((ray) => {
        ray.rotation.z += ray.userData.speed * 0.004;
      });

      if (this.ledger) {
        this.ledger.rotation.y = t * 0.18;
        this.ledger.position.y = 0.4 + Math.sin(t * 0.4) * 0.15;
      }

      this.rimLight.position.x = Math.sin(t * 0.3) * 6;

      this.renderer.render(this.scene, this.camera);
    }

    destroy() {
      if (this._raf) cancelAnimationFrame(this._raf);
      this.renderer.dispose();
    }
  }

  window.Ordinora = window.Ordinora || {};
  window.Ordinora.ThreeScene = ThreeScene;
})();

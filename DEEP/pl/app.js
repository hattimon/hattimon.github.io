// Consciousness Journey - Main Application
class ConsciousnessJourney {
    constructor() {
        // Data from JSON - fully translated to Polish
        this.consciousnessLevels = [
            {level: 20, name: "Wstyd", emotion: "Upokorzenie", question: "Czy często czujesz, że nie zasługujesz na szacunek innych?"},
            {level: 30, name: "Wina", emotion: "Obwinianie", question: "Czy dręczą Cię myśli o błędach z przeszłości?"},
            {level: 50, name: "Apatia", emotion: "Rozpacz", question: "Czy często czujesz, że nic nie ma sensu?"},
            {level: 75, name: "Smutek", emotion: "Żal", question: "Czy często doświadczasz głębokiej rozpaczy?"},
            {level: 100, name: "Lęk", emotion: "Niepokój", question: "Czy lęk paraliżuje Twoje działania?"},
            {level: 125, name: "Pragnienie", emotion: "Żądza", question: "Czy jesteś uzależniony od zewnętrznych źródeł satysfakcji?"},
            {level: 150, name: "Gniew", emotion: "Nienawiść", question: "Czy gniew często kontroluje Twoje reakcje?"},
            {level: 175, name: "Duma", emotion: "Pogarda", question: "Czy Twoja wartość zależy od osiągnięć i opinii innych?"},
            {level: 200, name: "Odwaga", emotion: "Afirmacja", question: "Czy podejmujesz działania mimo niepewności?"},
            {level: 250, name: "Neutralność", emotion: "Zaufanie", question: "Czy potrafisz pozostać spokojny w trudnych sytuacjach?"},
            {level: 310, name: "Chęć", emotion: "Optymizm", question: "Czy jesteś otwarty na uczenie się i rozwój?"},
            {level: 350, name: "Akceptacja", emotion: "Przebaczenie", question: "Czy akceptujesz rzeczy, których nie możesz zmienić?"},
            {level: 400, name: "Rozum", emotion: "Zrozumienie", question: "Czy podejmujesz decyzje oparte na logice i analizie?"},
            {level: 500, name: "Miłość", emotion: "Szacunek", question: "Czy czujesz bezwarunkową miłość do innych?"},
            {level: 540, name: "Radość", emotion: "Spokój", question: "Czy doświadczasz radości niezależnie od okoliczności?"},
            {level: 600, name: "Pokój", emotion: "Błogość", question: "Czy żyjesz w stanie wewnętrznego spokoju?"},
            {level: 700, name: "Oświecenie", emotion: "Istnienie", question: "Czy czujesz jedność ze wszystkim?"}
        ];

        this.practicesRecommendations = {
            "wstyd_wina": ["Praca z traumą", "Terapia grupowa", "Afirmacje samoakceptacji"],
            "apatia_smutek": ["Mindfulness", "Wsparcie terapeutyczne", "Praktyki wdzięczności"],
            "lek_pragnienie": ["Techniki oddechowe", "Wizualizacje", "Praca z lękami"],
            "gniew_duma": ["Medytacja loving-kindness", "Praca z ego", "Komunikacja bez przemocy"],
            "odwaga_neutralnosc": ["Mindfulness", "Praktyki groundingowe", "Rozwój asertywności"],
            "chec_akceptacja": ["Medytacja insight", "Praca z akceptacją", "Letting go"],
            "rozum_milosc": ["Praktyki serca", "Służba innym", "Rozwój empatii"],
            "radosc_pokoj": ["Zaawansowana medytacja", "Praktyki non-dualne", "Kontemplacja"],
            "oswiecenie": ["Niedualne nauczania", "Praktyki surrender", "Bycie w obecności"]
        };

        // Game state
        this.currentScreen = 'loading';
        this.currentQuestionIndex = 0;
        this.answers = [];
        this.audioEnabled = true;
        this.volume = 0.3;

        // 3D Scene
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.mineCart = null;
        this.tunnel = null;
        this.particles = [];
        
        // Audio
        this.audioContext = null;
        this.ambientSource = null;
        this.gainNode = null;

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupAudio();
        this.setup3DScene();
        this.startLoadingSequence();
    }

    setupEventListeners() {
        // Start button
        document.getElementById('start-btn').addEventListener('click', () => {
            this.startJourney();
        });

        // Audio toggle
        document.getElementById('audio-enabled').addEventListener('change', (e) => {
            this.audioEnabled = e.target.checked;
            this.updateAudio();
        });

        document.getElementById('audio-toggle').addEventListener('click', () => {
            this.audioEnabled = !this.audioEnabled;
            document.getElementById('audio-enabled').checked = this.audioEnabled;
            this.updateAudio();
            this.updateAudioIcon();
        });

        // Volume control
        document.getElementById('volume-slider').addEventListener('input', (e) => {
            this.volume = e.target.value / 100;
            this.updateVolume();
        });

        // Answer buttons - Fixed event delegation
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('answer-btn')) {
                const answer = e.target.getAttribute('data-answer');
                this.handleAnswer(answer);
            }
        });

        // Download report
        document.getElementById('download-report').addEventListener('click', () => {
            this.generatePDFReport();
        });

        // Restart journey
        document.getElementById('restart-journey').addEventListener('click', () => {
            this.restartJourney();
        });
    }

    setupAudio() {
        if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
            this.audioContext = new (AudioContext || webkitAudioContext)();
            this.gainNode = this.audioContext.createGain();
            this.gainNode.connect(this.audioContext.destination);
            this.gainNode.gain.setValueAtTime(this.volume, this.audioContext.currentTime);
        }
    }

    setup3DScene() {
        const canvas = document.getElementById('three-canvas');
        
        // Scene setup
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x0a0a0a, 10, 100);

        // Camera
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 2, 5);

        // Renderer
        this.renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x0a0a0a);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        this.createMineEnvironment();
        this.createMineCart();
        this.createParticles();
        this.createLighting();

        // Handle window resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    createMineEnvironment() {
        // Tunnel walls
        const tunnelGeometry = new THREE.CylinderGeometry(5, 5, 200, 8, 1, true);
        const tunnelMaterial = new THREE.MeshLambertMaterial({
            color: 0x2d1810,
            side: THREE.BackSide
        });
        this.tunnel = new THREE.Mesh(tunnelGeometry, tunnelMaterial);
        this.tunnel.position.y = -100;
        this.scene.add(this.tunnel);

        // Mine tracks
        const trackGeometry = new THREE.BoxGeometry(0.1, 0.05, 200);
        const trackMaterial = new THREE.MeshLambertMaterial({ color: 0x4a4a4a });
        
        const leftTrack = new THREE.Mesh(trackGeometry, trackMaterial);
        leftTrack.position.set(-0.8, -1.5, -100);
        this.scene.add(leftTrack);
        
        const rightTrack = new THREE.Mesh(trackGeometry, trackMaterial);
        rightTrack.position.set(0.8, -1.5, -100);
        this.scene.add(rightTrack);

        // Support beams
        for (let i = 0; i < 20; i++) {
            const beamGroup = new THREE.Group();
            
            // Horizontal beam
            const horizontalBeam = new THREE.Mesh(
                new THREE.BoxGeometry(8, 0.2, 0.2),
                new THREE.MeshLambertMaterial({ color: 0x4a3728 })
            );
            horizontalBeam.position.y = 3;
            
            // Vertical supports
            const leftSupport = new THREE.Mesh(
                new THREE.BoxGeometry(0.2, 6, 0.2),
                new THREE.MeshLambertMaterial({ color: 0x4a3728 })
            );
            leftSupport.position.set(-3.9, 0, 0);
            
            const rightSupport = new THREE.Mesh(
                new THREE.BoxGeometry(0.2, 6, 0.2),
                new THREE.MeshLambertMaterial({ color: 0x4a3728 })
            );
            rightSupport.position.set(3.9, 0, 0);
            
            beamGroup.add(horizontalBeam, leftSupport, rightSupport);
            beamGroup.position.z = -i * 10 - 5;
            this.scene.add(beamGroup);
        }
    }

    createMineCart() {
        const cartGroup = new THREE.Group();

        // Cart body
        const cartGeometry = new THREE.BoxGeometry(1.5, 0.8, 2);
        const cartMaterial = new THREE.MeshLambertMaterial({ color: 0x8b4513 });
        const cartBody = new THREE.Mesh(cartGeometry, cartMaterial);
        cartBody.position.y = 0.2;

        // Wheels
        const wheelGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 8);
        const wheelMaterial = new THREE.MeshLambertMaterial({ color: 0x2a2a2a });

        for (let i = 0; i < 4; i++) {
            const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
            wheel.rotation.z = Math.PI / 2;
            wheel.position.x = (i % 2) ? -0.8 : 0.8;
            wheel.position.z = (i < 2) ? -0.6 : 0.6;
            wheel.position.y = -0.2;
            cartGroup.add(wheel);
        }

        // Headlamp
        const lampGeometry = new THREE.SphereGeometry(0.1, 8, 6);
        const lampMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xffffaa,
            emissive: 0x444422
        });
        const headlamp = new THREE.Mesh(lampGeometry, lampMaterial);
        headlamp.position.set(0, 0.5, 1.2);

        cartGroup.add(cartBody, headlamp);
        cartGroup.position.set(0, -1, 0);
        this.mineCart = cartGroup;
        this.scene.add(cartGroup);
    }

    createParticles() {
        const particleCount = 500;
        const particleGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const velocities = [];

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 10;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
            positions[i * 3 + 2] = -Math.random() * 200;
            
            velocities.push({
                x: (Math.random() - 0.5) * 0.02,
                y: Math.random() * 0.01,
                z: Math.random() * 0.1 + 0.05
            });
        }

        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const particleMaterial = new THREE.PointsMaterial({
            color: 0xd4af37,
            size: 0.05,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });

        this.particles = new THREE.Points(particleGeometry, particleMaterial);
        this.particleVelocities = velocities;
        this.scene.add(this.particles);
    }

    createLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
        this.scene.add(ambientLight);

        // Headlamp spotlight
        const headlampLight = new THREE.SpotLight(0xffffaa, 1, 30, Math.PI / 6, 0.5);
        headlampLight.position.set(0, -0.5, 1.2);
        headlampLight.target.position.set(0, -1, -10);
        headlampLight.castShadow = true;
        this.scene.add(headlampLight);
        this.scene.add(headlampLight.target);

        // Flickering torches
        for (let i = 0; i < 10; i++) {
            const torchLight = new THREE.PointLight(0xff4500, 0.5, 10);
            torchLight.position.set(
                Math.random() > 0.5 ? -3 : 3,
                Math.random() * 2 + 1,
                -i * 20 - 10
            );
            this.scene.add(torchLight);

            // Animate torch flickering
            setInterval(() => {
                torchLight.intensity = 0.3 + Math.random() * 0.4;
            }, 100 + Math.random() * 200);
        }
    }

    startLoadingSequence() {
        let progress = 0;
        const progressBar = document.querySelector('.loading-progress');
        
        const loadingInterval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress > 100) {
                progress = 100;
                clearInterval(loadingInterval);
                setTimeout(() => {
                    this.showWelcomeScreen();
                }, 500);
            }
            progressBar.style.width = progress + '%';
        }, 150);
    }

    showWelcomeScreen() {
        document.getElementById('loading-screen').classList.add('hidden');
        document.getElementById('welcome-screen').classList.add('active');
        this.currentScreen = 'welcome';
    }

    startJourney() {
        document.getElementById('welcome-screen').classList.remove('active');
        document.getElementById('game-screen').classList.add('active');
        this.currentScreen = 'game';
        
        if (this.audioEnabled) {
            this.startAmbientMusic();
        }
        
        this.startAnimation();
        this.showFirstQuestion();
    }

    startAmbientMusic() {
        if (!this.audioContext) return;

        // Resume audio context if needed
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }

        // Create gentle ambient tones
        this.createAmbientTones();
    }

    createAmbientTones() {
        if (!this.audioContext || !this.gainNode) return;

        // Create multiple gentle oscillators for ambient atmosphere
        const frequencies = [120, 180, 240, 320]; // Low, calming frequencies
        
        frequencies.forEach((freq, index) => {
            const oscillator = this.audioContext.createOscillator();
            const oscGain = this.audioContext.createGain();
            
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime);
            
            // Very quiet volume for each tone
            oscGain.gain.setValueAtTime(0.02, this.audioContext.currentTime);
            
            // Add gentle modulation
            const lfo = this.audioContext.createOscillator();
            const lfoGain = this.audioContext.createGain();
            lfo.type = 'sine';
            lfo.frequency.setValueAtTime(0.1 + index * 0.05, this.audioContext.currentTime);
            lfoGain.gain.setValueAtTime(0.01, this.audioContext.currentTime);
            
            lfo.connect(lfoGain);
            lfoGain.connect(oscGain.gain);
            
            oscillator.connect(oscGain);
            oscGain.connect(this.gainNode);
            
            oscillator.start();
            lfo.start();
        });

        // Add gentle nature sounds simulation
        this.addNatureSounds();
    }

    addNatureSounds() {
        if (!this.audioContext) return;

        // Simulate gentle wind
        setInterval(() => {
            if (this.audioEnabled && this.audioContext) {
                const noise = this.audioContext.createBufferSource();
                const noiseBuffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * 2, this.audioContext.sampleRate);
                const output = noiseBuffer.getChannelData(0);
                
                for (let i = 0; i < output.length; i++) {
                    output[i] = (Math.random() * 2 - 1) * 0.01;
                }
                
                noise.buffer = noiseBuffer;
                
                const filter = this.audioContext.createBiquadFilter();
                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(400, this.audioContext.currentTime);
                
                const noiseGain = this.audioContext.createGain();
                noiseGain.gain.setValueAtTime(0.05, this.audioContext.currentTime);
                noiseGain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 1.5);
                
                noise.connect(filter);
                filter.connect(noiseGain);
                noiseGain.connect(this.gainNode);
                
                noise.start();
                noise.stop(this.audioContext.currentTime + 2);
            }
        }, 8000 + Math.random() * 5000);
    }

    updateAudio() {
        if (!this.audioEnabled) {
            if (this.gainNode) {
                this.gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            }
        } else {
            if (this.gainNode) {
                this.gainNode.gain.setValueAtTime(this.volume, this.audioContext.currentTime);
            }
            if (this.currentScreen === 'game' && !this.ambientSource) {
                this.startAmbientMusic();
            }
        }
    }

    updateVolume() {
        if (this.gainNode) {
            this.gainNode.gain.setValueAtTime(this.audioEnabled ? this.volume : 0, this.audioContext.currentTime);
        }
    }

    updateAudioIcon() {
        const icon = document.querySelector('.audio-icon');
        icon.textContent = this.audioEnabled ? '🔊' : '🔇';
    }

    startAnimation() {
        const animate = () => {
            requestAnimationFrame(animate);
            
            // Move cart down the tunnel
            if (this.mineCart) {
                this.mineCart.position.z -= 0.05;
                this.mineCart.rotation.x = Math.sin(Date.now() * 0.01) * 0.02;
            }

            // Move camera
            this.camera.position.z -= 0.05;

            // Update particles
            if (this.particles && this.particleVelocities) {
                const positions = this.particles.geometry.attributes.position.array;
                
                for (let i = 0; i < positions.length / 3; i++) {
                    positions[i * 3] += this.particleVelocities[i].x;
                    positions[i * 3 + 1] += this.particleVelocities[i].y;
                    positions[i * 3 + 2] += this.particleVelocities[i].z;
                    
                    // Reset particle if it goes too far
                    if (positions[i * 3 + 2] > 10) {
                        positions[i * 3] = (Math.random() - 0.5) * 10;
                        positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
                        positions[i * 3 + 2] = -200;
                    }
                }
                
                this.particles.geometry.attributes.position.needsUpdate = true;
            }

            this.renderer.render(this.scene, this.camera);
        };
        
        animate();
    }

    showFirstQuestion() {
        setTimeout(() => {
            this.showQuestion(0);
        }, 2000);
    }

    showQuestion(index) {
        if (index >= this.consciousnessLevels.length) {
            this.showResults();
            return;
        }

        const question = this.consciousnessLevels[index];
        const panel = document.getElementById('question-panel');
        
        // Ensure elements exist before setting content
        const titleElement = document.getElementById('question-title');
        const textElement = document.getElementById('question-text');
        
        if (titleElement && textElement) {
            titleElement.textContent = `Pytanie ${index + 1}/17`;
            textElement.textContent = question.question;
            
            console.log('Setting question:', question.question); // Debug log
        }
        
        panel.classList.add('active');
        
        // Update progress
        const progress = ((index + 1) / this.consciousnessLevels.length) * 100;
        const progressFill = document.getElementById('progress-fill');
        const depthValue = document.getElementById('depth-value');
        const levelValue = document.getElementById('level-value');
        
        if (progressFill) progressFill.style.width = progress + '%';
        if (depthValue) depthValue.textContent = Math.round(index * 50 + 50) + 'm';
        if (levelValue) levelValue.textContent = question.name;

        // Update music type display
        let musicType = 'Ambient';
        if (index < 6) musicType = 'Ambient głęboki';
        else if (index < 12) musicType = 'Ambient medytacyjny';
        else musicType = 'Ambient spokojny';
        
        const musicValueElement = document.getElementById('music-value');
        if (musicValueElement) {
            musicValueElement.textContent = musicType;
        }
    }

    handleAnswer(answer) {
        console.log('Answer received:', answer); // Debug log
        
        this.answers.push({
            questionIndex: this.currentQuestionIndex,
            level: this.consciousnessLevels[this.currentQuestionIndex],
            answer: answer
        });

        const panel = document.getElementById('question-panel');
        if (panel) {
            panel.classList.remove('active');
        }
        
        setTimeout(() => {
            this.currentQuestionIndex++;
            this.showQuestion(this.currentQuestionIndex);
        }, 1000);
    }

    calculateResults() {
        let totalScore = 0;
        let levelCounts = {};
        
        this.answers.forEach(answer => {
            const level = answer.level;
            const score = answer.answer === 'yes' ? level.level : 0;
            totalScore += score;
            
            const category = this.categorizeLevelForRecommendations(level.level);
            levelCounts[category] = (levelCounts[category] || 0) + (answer.answer === 'yes' ? 1 : 0);
        });

        const averageLevel = totalScore / this.answers.filter(a => a.answer === 'yes').length || 200;
        const dominantLevel = this.findClosestLevel(averageLevel);
        
        // Find barriers (levels with "no" answers)
        const barriers = this.answers
            .filter(a => a.answer === 'no' && a.level.level < averageLevel)
            .map(a => a.level);

        // Get recommendations based on dominant patterns
        const recommendations = this.getRecommendations(levelCounts, averageLevel);
        const developmentPath = this.getDevelopmentPath(averageLevel);

        return {
            averageLevel,
            dominantLevel,
            barriers,
            recommendations,
            developmentPath,
            totalAnswered: this.answers.filter(a => a.answer === 'yes').length
        };
    }

    findClosestLevel(targetLevel) {
        return this.consciousnessLevels.reduce((closest, current) => {
            return Math.abs(current.level - targetLevel) < Math.abs(closest.level - targetLevel) 
                ? current : closest;
        });
    }

    categorizeLevelForRecommendations(level) {
        if (level <= 30) return 'wstyd_wina';
        if (level <= 75) return 'apatia_smutek';
        if (level <= 125) return 'lek_pragnienie';
        if (level <= 175) return 'gniew_duma';
        if (level <= 250) return 'odwaga_neutralnosc';
        if (level <= 350) return 'chec_akceptacja';
        if (level <= 500) return 'rozum_milosc';
        if (level <= 600) return 'radosc_pokoj';
        return 'oswiecenie';
    }

    getRecommendations(levelCounts, averageLevel) {
        const category = this.categorizeLevelForRecommendations(averageLevel);
        return this.practicesRecommendations[category] || [];
    }

    getDevelopmentPath(averageLevel) {
        if (averageLevel < 200) {
            return "Twoja ścieżka rozwoju koncentruje się na uzdrawianiu i budowaniu podstaw. Praca z traumą, wsparcie terapeutyczne i budowanie pozytywnego obrazu siebie są kluczowe na tym etapie.";
        } else if (averageLevel < 400) {
            return "Jesteś na etapie budowania odwagi i pewności siebie. Rozwijaj mindfulness, asertywność i uczenia się akceptacji. To czas na eksplorację i rozwój osobisty.";
        } else if (averageLevel < 500) {
            return "Znajdujesz się na poziomie rozumu i logiki. Twoja ścieżka prowadzi do integracji wiedzy z mądrością serca. Rozwijaj empatię i służbę innym.";
        } else {
            return "Osiągnąłeś wysokie poziomy świadomości. Twoja ścieżka to dalsze pogłębianie praktyk medytacyjnych, kontemplacji i bycia w służbie ludzkości.";
        }
    }

    showResults() {
        // Stop ambient music gradually
        if (this.gainNode) {
            this.gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 2);
        }

        document.getElementById('game-screen').classList.remove('active');
        document.getElementById('results-screen').classList.add('active');
        this.currentScreen = 'results';

        const results = this.calculateResults();
        this.displayResults(results);
    }

    displayResults(results) {
        // Update consciousness meter
        const meterPosition = ((results.averageLevel - 20) / (700 - 20)) * 100;
        const meterElement = document.getElementById('consciousness-meter');
        if (meterElement) {
            meterElement.style.left = meterPosition + '%';
        }

        // Display dominant level
        const nameElement = document.getElementById('dominant-level-name');
        const descElement = document.getElementById('dominant-level-description');
        const scoreElement = document.getElementById('dominant-level-score');
        
        if (nameElement) nameElement.textContent = results.dominantLevel.name;
        if (descElement) descElement.textContent = `Emocja: ${results.dominantLevel.emotion}`;
        if (scoreElement) scoreElement.textContent = Math.round(results.averageLevel);

        // Display barriers
        const barriersList = document.getElementById('barriers-list');
        if (barriersList) {
            barriersList.innerHTML = '';
            results.barriers.slice(0, 5).forEach(barrier => {
                const li = document.createElement('li');
                li.textContent = `${barrier.name} - ${barrier.emotion}`;
                barriersList.appendChild(li);
            });
        }

        // Display recommendations
        const recList = document.getElementById('recommendations-list');
        if (recList) {
            recList.innerHTML = '';
            results.recommendations.forEach(rec => {
                const li = document.createElement('li');
                li.textContent = rec;
                recList.appendChild(li);
            });
        }

        // Display development path
        const devPathElement = document.getElementById('development-path');
        if (devPathElement) {
            devPathElement.textContent = results.developmentPath;
        }

        this.results = results;
    }

    generatePDFReport() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Set font for Polish characters support
        doc.setFont('helvetica');

        // Header
        doc.setFillColor(33, 128, 141);
        doc.rect(0, 0, 210, 40, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.text('Analiza Twojej Podswiadomosci', 20, 25);
        
        doc.setFontSize(12);
        doc.text('Wedlug Mapy Swiadomosci Davida R. Hawkinsa', 20, 35);

        // Reset text color
        doc.setTextColor(0, 0, 0);
        
        // Dominant consciousness level section
        doc.setFontSize(18);
        doc.setTextColor(212, 175, 55);
        doc.text('Dominujacy poziom swiadomosci:', 20, 60);
        
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text(`${this.results.dominantLevel.name}`, 20, 75);
        
        doc.setFontSize(12);
        doc.text(`Emocja: ${this.results.dominantLevel.emotion}`, 20, 85);
        doc.text(`Poziom: ${Math.round(this.results.averageLevel)}`, 20, 95);

        // Consciousness meter visualization
        doc.setFillColor(220, 220, 220);
        doc.rect(20, 105, 170, 8, 'F');
        
        const meterPosition = ((this.results.averageLevel - 20) / (700 - 20)) * 170;
        doc.setFillColor(33, 128, 141);
        doc.rect(20, 105, meterPosition, 8, 'F');
        
        doc.setFontSize(10);
        doc.text('Wstyd', 20, 120);
        doc.text('Oswiecenie', 170, 120);

        // Barriers section
        doc.setFontSize(16);
        doc.setTextColor(212, 175, 55);
        doc.text('Glowne bariery do przezwyciezenia:', 20, 140);
        
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        let yPos = 155;
        this.results.barriers.slice(0, 5).forEach(barrier => {
            doc.text(`• ${barrier.name} - ${barrier.emotion}`, 25, yPos);
            yPos += 10;
        });

        // Recommendations section
        doc.setFontSize(16);
        doc.setTextColor(212, 175, 55);
        doc.text('Zalecane praktyki:', 20, yPos + 15);
        
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        yPos += 30;
        this.results.recommendations.forEach(rec => {
            doc.text(`• ${rec}`, 25, yPos);
            yPos += 10;
        });

        // Development path section
        doc.setFontSize(16);
        doc.setTextColor(212, 175, 55);
        doc.text('Sciezka Rozwoju Osobistego:', 20, yPos + 15);
        
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        const splitPath = doc.splitTextToSize(this.results.developmentPath, 170);
        doc.text(splitPath, 20, yPos + 30);

        // Footer
        yPos = 280;
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text('"Swiadomosc sama w sobie jest zrodlem uzdrowienia."', 20, yPos);
        doc.text('- David R. Hawkins', 20, yPos + 8);
        
        // Generation date
        const now = new Date();
        doc.text(`Wygenerowano: ${now.toLocaleDateString('pl-PL')}`, 140, yPos + 8);

        // Save the PDF
        doc.save('raport-swiadomosci.pdf');
    }

    restartJourney() {
        this.currentQuestionIndex = 0;
        this.answers = [];
        
        // Stop audio
        if (this.gainNode) {
            this.gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        }
        
        document.getElementById('results-screen').classList.remove('active');
        document.getElementById('welcome-screen').classList.add('active');
        this.currentScreen = 'welcome';

        // Reset 3D scene
        if (this.mineCart) {
            this.mineCart.position.set(0, -1, 0);
        }
        this.camera.position.set(0, 2, 5);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ConsciousnessJourney();
});

// Handle page visibility change to pause/resume audio
document.addEventListener('visibilitychange', () => {
    // Audio context handling for better browser compatibility
    if (document.hidden) {
        // Page is now hidden
    } else {
        // Page is now visible
    }
});
// Consciousness Journey - Main Application
class ConsciousnessJourney {
    constructor() {
        // Data from JSON
        this.consciousnessLevels = [
            {level: 20, name: "Shame", emotion: "Humiliation", question: "Czy często czujesz, że nie zasługujesz na szacunek innych?"},
            {level: 30, name: "Guilt", emotion: "Blame", question: "Czy dręczą Cię myśli o błędach z przeszłości?"},
            {level: 50, name: "Apathy", emotion: "Despair", question: "Czy często czujesz, że nic nie ma sensu?"},
            {level: 75, name: "Grief", emotion: "Regret", question: "Czy często doświadczasz głębokiej rozpaczy?"},
            {level: 100, name: "Fear", emotion: "Anxiety", question: "Czy lęk paraliżuje Twoje działania?"},
            {level: 125, name: "Desire", emotion: "Craving", question: "Czy jesteś uzależniony od zewnętrznych źródeł satysfakcji?"},
            {level: 150, name: "Anger", emotion: "Hate", question: "Czy gniew często kontroluje Twoje reakcje?"},
            {level: 175, name: "Pride", emotion: "Scorn", question: "Czy Twoja wartość zależy od osiągnięć i opinii innych?"},
            {level: 200, name: "Courage", emotion: "Affirmation", question: "Czy podejmujesz działania mimo niepewności?"},
            {level: 250, name: "Neutrality", emotion: "Trust", question: "Czy potrafisz pozostać spokojny w trudnych sytuacjach?"},
            {level: 310, name: "Willingness", emotion: "Optimism", question: "Czy jesteś otwarty na uczenie się i rozwój?"},
            {level: 350, name: "Acceptance", emotion: "Forgiveness", question: "Czy akceptujesz rzeczy, których nie możesz zmienić?"},
            {level: 400, name: "Reason", emotion: "Understanding", question: "Czy podejmujesz decyzje oparte na logice i analizie?"},
            {level: 500, name: "Love", emotion: "Reverence", question: "Czy czujesz bezwarunkową miłość do innych?"},
            {level: 540, name: "Joy", emotion: "Serenity", question: "Czy doświadczasz radości niezależnie od okoliczności?"},
            {level: 600, name: "Peace", emotion: "Bliss", question: "Czy żyjesz w stanie wewnętrznego spokoju?"},
            {level: 700, name: "Enlightenment", emotion: "Is-ness", question: "Czy czujesz jedność ze wszystkim?"}
        ];

        this.practicesRecommendations = {
            "shame_guilt": ["Praca z traumą", "Terapia grupowa", "Afirmacje samoakceptacji"],
            "apathy_grief": ["Medytacja uważności", "Wsparcie terapeutyczne", "Praktyki wdzięczności"],
            "fear_desire": ["Techniki oddechowe", "Wizualizacje", "Praca z lękami"],
            "anger_pride": ["Medytacja lovingkindness", "Praca z ego", "Komunikacja bez przemocy"],
            "courage_neutrality": ["Mindfulness", "Praktyki groundingowe", "Rozwój asertywności"],
            "willingness_acceptance": ["Medytacja insight", "Praca z akceptacją", "Letting go technique"],
            "reason_love": ["Praktyki serca", "Służba innym", "Rozwój empatii"],
            "joy_peace": ["Zaawansowana medytacja", "Praktyki non-dualne", "Kontemplacja"],
            "enlightenment": ["Niedualne nauczania", "Surrender practices", "Being in presence"]
        };

        // Game state
        this.currentScreen = 'loading';
        this.currentQuestionIndex = 0;
        this.answers = [];
        this.audioEnabled = true;
        this.currentFrequency = 12; // Beta

        // 3D Scene
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.mineCart = null;
        this.tunnel = null;
        this.particles = [];
        
        // Audio
        this.audioContext = null;
        this.binauralOscillator = null;
        this.ambientAudio = null;

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

        // Answer buttons
        document.querySelectorAll('.answer-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleAnswer(e.target.dataset.answer);
            });
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
            this.startBinauralBeats();
            this.playAmbientSounds();
        }
        
        this.startAnimation();
        this.showFirstQuestion();
    }

    startBinauralBeats() {
        if (!this.audioContext) return;

        // Resume audio context if needed
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }

        // Create binaural beats
        const leftOscillator = this.audioContext.createOscillator();
        const rightOscillator = this.audioContext.createOscillator();
        const leftGain = this.audioContext.createGain();
        const rightGain = this.audioContext.createGain();
        const merger = this.audioContext.createChannelMerger(2);

        leftOscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
        rightOscillator.frequency.setValueAtTime(200 + this.currentFrequency, this.audioContext.currentTime);

        leftGain.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        rightGain.gain.setValueAtTime(0.1, this.audioContext.currentTime);

        leftOscillator.connect(leftGain);
        rightOscillator.connect(rightGain);
        leftGain.connect(merger, 0, 0);
        rightGain.connect(merger, 0, 1);
        merger.connect(this.audioContext.destination);

        leftOscillator.start();
        rightOscillator.start();

        this.binauralOscillator = { left: leftOscillator, right: rightOscillator };
    }

    playAmbientSounds() {
        // Create ambient mine sounds with Web Audio API
        if (!this.audioContext) return;

        // Water dripping sound
        setInterval(() => {
            if (this.audioEnabled && Math.random() < 0.3) {
                const oscillator = this.audioContext.createOscillator();
                const gain = this.audioContext.createGain();
                
                oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.1);
                
                gain.gain.setValueAtTime(0.05, this.audioContext.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.3);
                
                oscillator.connect(gain);
                gain.connect(this.audioContext.destination);
                
                oscillator.start();
                oscillator.stop(this.audioContext.currentTime + 0.3);
            }
        }, 3000 + Math.random() * 5000);
    }

    updateAudio() {
        if (!this.audioEnabled && this.binauralOscillator) {
            this.binauralOscillator.left.stop();
            this.binauralOscillator.right.stop();
            this.binauralOscillator = null;
        } else if (this.audioEnabled && !this.binauralOscillator && this.currentScreen === 'game') {
            this.startBinauralBeats();
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
        
        document.getElementById('question-title').textContent = `Pytanie ${index + 1}/17`;
        document.getElementById('question-text').textContent = question.question;
        
        panel.classList.add('active');
        
        // Update progress
        const progress = ((index + 1) / this.consciousnessLevels.length) * 100;
        document.getElementById('progress-fill').style.width = progress + '%';
        document.getElementById('depth-value').textContent = Math.round(index * 50 + 50) + 'm';
        document.getElementById('level-value').textContent = question.name;

        // Update frequency gradually
        const targetFreq = 12 - (index / this.consciousnessLevels.length) * 6; // 12Hz to 6Hz
        this.updateFrequency(targetFreq);
    }

    updateFrequency(targetFreq) {
        this.currentFrequency = Math.round(targetFreq);
        
        let freqLabel = '';
        if (this.currentFrequency >= 10) freqLabel = 'Beta';
        else if (this.currentFrequency >= 8) freqLabel = 'Alpha';
        else freqLabel = 'Theta';
        
        document.getElementById('frequency-value').textContent = `${this.currentFrequency}Hz (${freqLabel})`;

        // Update binaural beats if playing
        if (this.binauralOscillator && this.audioContext) {
            this.binauralOscillator.right.frequency.setValueAtTime(
                200 + this.currentFrequency, 
                this.audioContext.currentTime
            );
        }
    }

    handleAnswer(answer) {
        this.answers.push({
            questionIndex: this.currentQuestionIndex,
            level: this.consciousnessLevels[this.currentQuestionIndex],
            answer: answer
        });

        document.getElementById('question-panel').classList.remove('active');
        
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

        return {
            averageLevel,
            dominantLevel,
            barriers,
            recommendations,
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
        if (level <= 30) return 'shame_guilt';
        if (level <= 75) return 'apathy_grief';
        if (level <= 125) return 'fear_desire';
        if (level <= 175) return 'anger_pride';
        if (level <= 250) return 'courage_neutrality';
        if (level <= 350) return 'willingness_acceptance';
        if (level <= 500) return 'reason_love';
        if (level <= 600) return 'joy_peace';
        return 'enlightenment';
    }

    getRecommendations(levelCounts, averageLevel) {
        const category = this.categorizeLevelForRecommendations(averageLevel);
        return this.practicesRecommendations[category] || [];
    }

    showResults() {
        // Stop binaural beats
        if (this.binauralOscillator) {
            this.binauralOscillator.left.stop();
            this.binauralOscillator.right.stop();
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
        document.getElementById('consciousness-meter').style.left = meterPosition + '%';

        // Display dominant level
        document.getElementById('dominant-level-name').textContent = results.dominantLevel.name;
        document.getElementById('dominant-level-description').textContent = 
            `Emocja: ${results.dominantLevel.emotion}`;
        document.getElementById('dominant-level-score').textContent = 
            Math.round(results.averageLevel);

        // Display barriers
        const barriersList = document.getElementById('barriers-list');
        barriersList.innerHTML = '';
        results.barriers.slice(0, 5).forEach(barrier => {
            const li = document.createElement('li');
            li.textContent = `${barrier.name} - ${barrier.emotion}`;
            barriersList.appendChild(li);
        });

        // Display recommendations
        const recList = document.getElementById('recommendations-list');
        recList.innerHTML = '';
        results.recommendations.forEach(rec => {
            const li = document.createElement('li');
            li.textContent = rec;
            recList.appendChild(li);
        });

        this.results = results;
    }

    generatePDFReport() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Title
        doc.setFontSize(20);
        doc.setTextColor(33, 128, 141);
        doc.text('Raport Analizy Świadomości', 20, 30);

        // Subtitle
        doc.setFontSize(12);
        doc.setTextColor(100);
        doc.text('Według Mapy Świadomości Davida R. Hawkinsa', 20, 40);

        // Results section
        doc.setFontSize(16);
        doc.setTextColor(0);
        doc.text('Wyniki Analizy', 20, 60);

        doc.setFontSize(12);
        doc.text(`Dominujący poziom świadomości: ${this.results.dominantLevel.name}`, 20, 75);
        doc.text(`Średni poziom: ${Math.round(this.results.averageLevel)}`, 20, 85);
        doc.text(`Emocja dominująca: ${this.results.dominantLevel.emotion}`, 20, 95);

        // Barriers section
        doc.setFontSize(16);
        doc.text('Główne Bariery do Przezwyciężenia', 20, 120);
        
        doc.setFontSize(12);
        let yPos = 135;
        this.results.barriers.slice(0, 5).forEach(barrier => {
            doc.text(`• ${barrier.name} - ${barrier.emotion}`, 25, yPos);
            yPos += 10;
        });

        // Recommendations section
        doc.setFontSize(16);
        doc.text('Zalecane Praktyki Rozwoju', 20, yPos + 15);
        
        doc.setFontSize(12);
        yPos += 30;
        this.results.recommendations.forEach(rec => {
            doc.text(`• ${rec}`, 25, yPos);
            yPos += 10;
        });

        // Hawkins quote
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text('"Świadomość sama w sobie jest źródłem uzdrowienia."', 20, 260);
        doc.text('- David R. Hawkins', 20, 270);

        // Save the PDF
        doc.save('raport-swiadomosci.pdf');
    }

    restartJourney() {
        this.currentQuestionIndex = 0;
        this.answers = [];
        this.currentFrequency = 12;
        
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
});
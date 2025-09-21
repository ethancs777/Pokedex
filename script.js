const API_URL = "https://pokeapi.co/api/v2/";

const CACHE_KEYS = {
    POKEMON_LIST: 'pokemon_list_cache',
    POKEMON_DETAILS: 'pokemon_details_cache',
    MOVE_TYPES: 'move_types_cache',
    MOVES_LIST: 'moves_list_cache',
    ABILITIES_LIST: 'abilities_list_cache',
    CACHE_VERSION: 'pokemon_cache_version',
    CACHE_TIMESTAMP: 'pokemon_cache_timestamp'
};

const CACHE_CONFIG = {
    VERSION: '1.2', // Increment version to invalidate cache with filtered moves
    EXPIRY_DAYS: 7 // Cache expires after 7 days
};

const POKEMON_LIMITS = {
    TOTAL: 1302,
    FIRST_GENERATION: 151,
    SEARCH_RESULTS: 20,
};

const SPECIAL_POKEMON_NAMES = {
    'nidoran-f': 'Nidoran♀',
    'nidoran-m': 'Nidoran♂',
    'mr-mime': 'Mr. Mime',
    'mime-jr': 'Mime Jr.',
    'type-null': 'Type: Null',
    'mr-rime': 'Mr. Rime'
};

const HYPHENATED_POKEMON_NAMES = [
    'ho-oh', 'porygon-z', 'jangmo-o', 'hakamo-o', 'kommo-o',
    'tapu-koko', 'tapu-lele', 'tapu-bulu', 'tapu-fini',
    'ting-lu', 'chien-pao', 'wo-chien', 'chi-yu'
];

const VARIANT_POKEMON_NAMES = [
    'abomasnow-mega', 'absol-mega', 'aegislash-blade', 'aegislash-shield', 'aerodactyl-mega', 'aggron-mega',
    'alakazam-mega', 'alcremie-gmax', 'altaria-mega', 'ampharos-mega', 'appletun-gmax', 'araquanid-totem',
    'arcanine-hisui', 'articuno-galar', 'audino-mega', 'avalugg-hisui', 'banette-mega', 'basculegion-female',
    'basculegion-male', 'basculin-blue-striped', 'basculin-red-striped', 'basculin-white-striped', 'beedrill-mega',
    'blastoise-gmax', 'blastoise-mega', 'blaziken-mega', 'braviary-hisui', 'brute-bonnet', 'butterfree-gmax',
    'calyrex-ice', 'calyrex-shadow', 'camerupt-mega', 'castform-rainy', 'castform-snowy', 'castform-sunny',
    'centiskorch-gmax', 'charizard-gmax', 'charizard-mega-x', 'charizard-mega-y', 'chien-pao', 'chi-yu',
    'cinderace-gmax', 'coalossal-gmax', 'copperajah-gmax', 'corsola-galar', 'corviknight-gmax', 'cramorant-gorging',
    'cramorant-gulping', 'darmanitan-galar-standard', 'darmanitan-galar-zen', 'darmanitan-standard', 'darmanitan-zen',
    'darumaka-galar', 'decidueye-hisui', 'deoxys-attack', 'deoxys-defense', 'deoxys-normal', 'deoxys-speed',
    'dialga-origin', 'diancie-mega', 'diglett-alola', 'drednaw-gmax', 'dudunsparce-three-segment', 'dudunsparce-two-segment',
    'dugtrio-alola', 'duraludon-gmax', 'eevee-gmax', 'eevee-starter', 'eiscue-ice', 'eiscue-noice',
    'electrode-hisui', 'enamorus-incarnate', 'enamorus-therian', 'eternatus-eternamax', 'exeggutor-alola', 'farfetchd-galar',
    'flapple-gmax', 'floette-eternal', 'flutter-mane', 'gallade-mega', 'garbodor-gmax', 'garchomp-mega',
    'gardevoir-mega', 'gengar-gmax', 'gengar-mega', 'geodude-alola', 'gimmighoul-roaming', 'giratina-altered',
    'giratina-origin', 'glalie-mega', 'golem-alola', 'goodra-hisui', 'gouging-fire', 'gourgeist-average',
    'gourgeist-large', 'gourgeist-small', 'gourgeist-super', 'graveler-alola', 'great-tusk', 'greninja-ash',
    'greninja-battle-bond', 'grimer-alola', 'grimmsnarl-gmax', 'groudon-primal', 'growlithe-hisui', 'gumshoos-totem',
    'gyarados-mega', 'hakamo-o', 'hatterene-gmax', 'heracross-mega', 'ho-oh', 'hoopa-unbound',
    'houndoom-mega', 'indeedee-female', 'indeedee-male', 'inteleon-gmax', 'iron-boulder', 'iron-bundle',
    'iron-crown', 'iron-hands', 'iron-jugulis', 'iron-leaves', 'iron-moth', 'iron-thorns', 'iron-treads',
    'iron-valiant', 'jangmo-o', 'kangaskhan-mega', 'keldeo-ordinary', 'keldeo-resolute', 'kingler-gmax',
    'kommo-o', 'kommo-o-totem', 'koraidon-gliding-build', 'koraidon-limited-build', 'koraidon-sprinting-build', 'koraidon-swimming-build',
    'kyogre-primal', 'kyurem-black', 'kyurem-white', 'landorus-incarnate', 'landorus-therian', 'lapras-gmax',
    'latias-mega', 'latios-mega', 'lilligant-hisui', 'linoone-galar', 'lopunny-mega', 'lucario-mega',
    'lurantis-totem', 'lycanroc-dusk', 'lycanroc-midday', 'lycanroc-midnight', 'machamp-gmax', 'magearna-original',
    'manectric-mega', 'marowak-alola', 'marowak-totem', 'maushold-family-of-four', 'maushold-family-of-three', 'mawile-mega',
    'medicham-mega', 'melmetal-gmax', 'meloetta-aria', 'meloetta-pirouette', 'meowstic-female', 'meowstic-male',
    'meowth-alola', 'meowth-galar', 'meowth-gmax', 'metagross-mega', 'mewtwo-mega-x', 'mewtwo-mega-y',
    'mime-jr', 'mimikyu-busted', 'mimikyu-disguised', 'mimikyu-totem-busted', 'mimikyu-totem-disguised', 'minior-blue',
    'minior-blue-meteor', 'minior-green', 'minior-green-meteor', 'minior-indigo', 'minior-indigo-meteor', 'minior-orange',
    'minior-orange-meteor', 'minior-red', 'minior-red-meteor', 'minior-violet', 'minior-violet-meteor', 'minior-yellow',
    'minior-yellow-meteor', 'miraidon-aquatic-mode', 'miraidon-drive-mode', 'miraidon-glide-mode', 'miraidon-low-power-mode', 'moltres-galar',
    'morpeko-full-belly', 'morpeko-hangry', 'mr-mime', 'mr-mime-galar', 'mr-rime', 'muk-alola',
    'necrozma-dawn', 'necrozma-dusk', 'necrozma-ultra', 'nidoran-f', 'nidoran-m', 'ninetales-alola',
    'ogerpon-cornerstone-mask', 'ogerpon-hearthflame-mask', 'ogerpon-wellspring-mask', 'oinkologne-female', 'oinkologne-male', 'orbeetle-gmax',
    'oricorio-baile', 'oricorio-pau', 'oricorio-pom-pom', 'oricorio-sensu', 'palafin-hero', 'palafin-zero',
    'palkia-origin', 'persian-alola', 'pidgeot-mega', 'pikachu-alola-cap', 'pikachu-belle', 'pikachu-cosplay',
    'pikachu-gmax', 'pikachu-hoenn-cap', 'pikachu-kalos-cap', 'pikachu-libre', 'pikachu-original-cap', 'pikachu-partner-cap',
    'pikachu-phd', 'pikachu-pop-star', 'pikachu-rock-star', 'pikachu-sinnoh-cap', 'pikachu-starter', 'pikachu-unova-cap',
    'pikachu-world-cap', 'pinsir-mega', 'ponyta-galar', 'porygon-z', 'pumpkaboo-average', 'pumpkaboo-large',
    'pumpkaboo-small', 'pumpkaboo-super', 'qwilfish-hisui', 'raging-bolt', 'raichu-alola', 'rapidash-galar',
    'raticate-alola', 'raticate-totem-alola', 'rattata-alola', 'rayquaza-mega', 'ribombee-totem', 'rillaboom-gmax',
    'roaring-moon', 'rockruff-own-tempo', 'rotom-fan', 'rotom-frost', 'rotom-heat', 'rotom-mow',
    'rotom-wash', 'sableye-mega', 'salamence-mega', 'salazzle-totem', 'samurott-hisui', 'sandaconda-gmax',
    'sandshrew-alola', 'sandslash-alola', 'sandy-shocks', 'sceptile-mega', 'scizor-mega', 'scream-tail',
    'sharpedo-mega', 'shaymin-land', 'shaymin-sky', 'sliggoo-hisui', 'slither-wing', 'slowbro-galar',
    'slowbro-mega', 'slowking-galar', 'slowpoke-galar', 'sneasel-hisui', 'snorlax-gmax', 'squawkabilly-blue-plumage',
    'squawkabilly-green-plumage', 'squawkabilly-white-plumage', 'squawkabilly-yellow-plumage', 'steelix-mega', 'stunfisk-galar', 'swampert-mega',
    'tapu-bulu', 'tapu-fini', 'tapu-koko', 'tapu-lele', 'tatsugiri-curly', 'tatsugiri-droopy',
    'tatsugiri-stretchy', 'tauros-paldea-aqua-breed', 'tauros-paldea-blaze-breed', 'tauros-paldea-combat-breed', 'terapagos-stellar', 'terapagos-terastal',
    'thundurus-incarnate', 'thundurus-therian', 'ting-lu', 'togedemaru-totem', 'tornadus-incarnate', 'tornadus-therian',
    'toxtricity-amped', 'toxtricity-amped-gmax', 'toxtricity-low-key', 'toxtricity-low-key-gmax', 'type-null', 'typhlosion-hisui',
    'tyranitar-mega', 'ursaluna-bloodmoon', 'urshifu-rapid-strike', 'urshifu-rapid-strike-gmax', 'urshifu-single-strike', 'urshifu-single-strike-gmax',
    'venusaur-gmax', 'venusaur-mega', 'vikavolt-totem', 'voltorb-hisui', 'vulpix-alola', 'walking-wake',
    'weezing-galar', 'wishiwashi-school', 'wishiwashi-solo', 'wo-chien', 'wooper-paldea', 'wormadam-plant',
    'wormadam-sandy', 'wormadam-trash', 'yamask-galar', 'zacian-crowned', 'zamazenta-crowned', 'zapdos-galar',
    'zarude-dada', 'zigzagoon-galar', 'zoroark-hisui', 'zorua-hisui', 'zygarde-10', 'zygarde-10-power-construct',
    'zygarde-50', 'zygarde-50-power-construct', 'zygarde-complete'
];

const ROTOM_FORMS = {
    'fan': 'Fan',
    'frost': 'Frost',
    'heat': 'Heat',
    'mow': 'Mow',
    'wash': 'Wash'
};

const GENERATION_RANGES = {
    1: { min: 1, max: 151 },
    2: { min: 152, max: 251 },
    3: { min: 252, max: 386 },
    4: { min: 387, max: 493 },
    5: { min: 494, max: 649 },
    6: { min: 650, max: 721 },
    7: { min: 722, max: 809 },
    8: { min: 810, max: 905 },
    9: { min: 906, max: 1302 }
};


/* 
HELPER FUNCTIONS
*/

function formatPokemonDisplayName(pokemonName) {
    if (SPECIAL_POKEMON_NAMES[pokemonName]) {
        return SPECIAL_POKEMON_NAMES[pokemonName];
    }
    
    if (HYPHENATED_POKEMON_NAMES.includes(pokemonName)) {
        return pokemonName
            .split('-')
            .map(part => part.charAt(0).toUpperCase() + part.slice(1))
            .join('-');
    }
    
    const parts = pokemonName.split('-');
    const baseName = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
    
    if (parts.length === 1) {
        return baseName;
    }
    
    const formPart = parts.slice(1).join('-');
    
    if (formPart === 'mega' || formPart === 'mega-x' || formPart === 'mega-y') {
        const megaType = formPart === 'mega' ? 'Mega' : 
                        formPart === 'mega-x' ? 'Mega X' : 'Mega Y';
        return `${baseName} (${megaType})`;
    }
    
    if (formPart === 'alola') return `${baseName} (Alolan)`;
    if (formPart === 'galar') return `${baseName} (Galarian)`;
    if (formPart === 'hisui') return `${baseName} (Hisuian)`;
    
    if (baseName === 'Rotom' && ROTOM_FORMS[formPart]) {
        return `Rotom (${ROTOM_FORMS[formPart]})`;
    }
    
    if (baseName === 'Deoxys') {
        const deoxysForm = formPart.charAt(0).toUpperCase() + formPart.slice(1);
        return `Deoxys (${deoxysForm})`;
    }
    
    const formattedForm = formPart
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    
    return `${baseName} (${formattedForm})`;
}

function getBasePokemonName(pokemonName) {
    if (HYPHENATED_POKEMON_NAMES.includes(pokemonName) || VARIANT_POKEMON_NAMES.includes(pokemonName)) {
        return pokemonName;
    }
    
    return pokemonName.split('-')[0];
}

function toTitleCase(text) {
    return text
        .toLowerCase()
        .replace(/-/g, ' ') // Replace hyphens with spaces
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

function cleanText(text) {
    return text.replace(/\f/g, ' ').replace(/\n/g, ' ');
}

function findEnglishEntry(entries, property = 'effect') {
    return entries.find(entry => entry.language.name === 'en');
}

function getDescriptionFromEntry(entry, property = 'effect', fallback = 'No description available.') {
    if (!entry) return fallback;
    
    // Try the specified property first
    let text = entry[property];
    
    // If that fails, try common alternatives
    if (!text) {
        if (property === 'effect') {
            text = entry.short_effect || entry.flavor_text;
        } else if (property === 'flavor_text') {
            text = entry.flavor_text || entry.effect || entry.short_effect;
        }
    }
    
    return text ? cleanText(text) : fallback;
}

function isValidPokemon(pokemon) {
    if (!pokemon) return false;
    const hasSprite = pokemon.sprite || (pokemon.sprites && pokemon.sprites.front_default);
    return hasSprite && hasSprite.trim() !== '';
}

// Navigation system to handle back button functionality
const NavigationSystem = {
    stack: [],
    
    push(page) {
        this.stack.push(page);
    },
    
    pop() {
        return this.stack.pop();
    },
    
    canGoBack() {
        return this.stack.length > 0;
    },
    
    getBackButtonText() {
        if (this.stack.length === 0) {
            return "← Back to Pokemon Grid";
        }
        
        const previousPage = this.stack[this.stack.length - 1];
        switch (previousPage.type) {
            case 'home':
                return "← Back to Pokemon Grid";
            case 'pokemon':
                const pokemonName = formatPokemonDisplayName(previousPage.data);
                return `← Back to ${pokemonName}`;
            case 'move':
                const moveName = toTitleCase(previousPage.data);
                return `← Back to ${moveName}`;
            case 'ability':
                const abilityName = toTitleCase(previousPage.data);
                return `← Back to ${abilityName}`;
            case 'moves':
                return "← Back to All Moves";
            case 'abilities':
                return "← Back to All Abilities";
            default:
                return "← Back";
        }
    },
    
    goHome() {
        // Clear the navigation stack and go to home
        this.stack = [];
        this.showHomePage();
    },
    
    createNavigationBar() {
        const backButtonText = this.getBackButtonText();
        return `
            <div class="navigation-bar">
                <button id="back-button">${backButtonText}</button>
            </div>
        `;
    },
    
    setupNavigationListeners() {
        const backButton = document.getElementById('back-button');
        
        if (backButton) {
            backButton.addEventListener('click', () => this.goBack());
        }
    },
    
    goBack() {
        if (this.canGoBack()) {
            const previousPage = this.pop();
            if (previousPage.type === 'home') {
                this.showHomePage();
            } else if (previousPage.type === 'pokemon') {
                this.showPokemonDetail(previousPage.data);
            } else if (previousPage.type === 'move') {
                displayMoveDetails(previousPage.data);
            } else if (previousPage.type === 'ability') {
                displayAbilityDetails(previousPage.data);
            } else if (previousPage.type === 'moves') {
                this.showMovesPage();
            } else if (previousPage.type === 'abilities') {
                this.showAbilitiesPage();
            }
        } else {
            // Default fallback to home
            this.showHomePage();
        }
    },
    
    createTopNavigation() {
        return `
            <nav class="top-navbar">
                <span class="nav-item" data-nav="home">Home</span>
                <span class="nav-item" data-nav="moves">Moves</span>
                <span class="nav-item" data-nav="abilities">Abilities</span>
                <span class="nav-item" data-nav="types">Types</span>
            </nav>
        `;
    },
    
    setupTopNavigationListeners() {
        document.querySelectorAll('.top-navbar .nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const navType = e.target.dataset.nav;
                this.handleTopNavigation(navType);
                this.updateActiveNavItem(navType);
            });
        });
    },
    
    handleTopNavigation(navType) {
        this.stack = []; // Clear navigation stack when using top nav
        switch(navType) {
            case 'home':
                this.showHomePage();
                break;
            case 'moves':
                this.showMovesPage();
                break;
            case 'abilities':
                this.showAbilitiesPage();
                break;
            case 'types':
                this.showTypesPage();
                break;
        }
    },
    
    updateActiveNavItem(activeNav) {
        document.querySelectorAll('.top-navbar .nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.nav === activeNav) {
                item.classList.add('active');
            }
        });
    },
    
    showHomePage() {
        const main = document.querySelector('main');
        main.innerHTML = `
            <div id="search">
                <input type="text" id="pokemon-input" placeholder="Enter Pokemon name or ID">
                <button id="search-button">Search</button>
            </div>
            <div id="sorting-controls">
                <label for="sort-select">Sort by:</label>
                <select id="sort-select">
                    <option value="id-asc">Generation (Oldest to Newest)</option>
                    <option value="id-desc">Generation (Newest to Oldest)</option>
                    <option value="name-asc">Name (A-Z)</option>
                    <option value="name-desc">Name (Z-A)</option>
                </select>
                <label for="generation-filter">Generation:</label>
                <select id="generation-filter">
                    <option value="all">All Generations</option>
                    <option value="1">Gen 1 (1-151)</option>
                    <option value="2">Gen 2 (152-251)</option>
                    <option value="3">Gen 3 (252-386)</option>
                    <option value="4">Gen 4 (387-493)</option>
                    <option value="5">Gen 5 (494-649)</option>
                    <option value="6">Gen 6 (650-721)</option>
                    <option value="7">Gen 7 (722-809)</option>
                    <option value="8">Gen 8 (810-905)</option>
                    <option value="9">Gen 9 (906+)</option>
                </select>
            </div>
            <div id="pokemon-display"></div>
        `;
        displayAllPokemon();
        setupSearchFunctionality();
        setupSortingFunctionality();
    },
    
    async showPokemonDetail(pokemonName) {
        const detailedPokemon = await getPokemonDetailedData(pokemonName);
        if (detailedPokemon) {
            displayPokemonDetail(detailedPokemon);
        }
    },
    
    async showMovesPage() {
        const main = document.querySelector('main');
        main.innerHTML = `
            <div class="detail-container">
                <h1 class="detail-name">All Moves</h1>
                <div id="moves-loading" class="loading">Loading moves...</div>
                <div id="moves-by-type-container"></div>
            </div>
        `;
        this.updateActiveNavItem('moves');
        
        try {
            // Try to load from cache first
            let movesWithTypes = CACHE_UTILS.loadMovesData();
            
            if (!movesWithTypes) {
                // Cache miss - fetch from API
                console.log('Fetching moves from API...');
                const response = await fetch(`${API_URL}move?limit=1000`);
                const data = await response.json();
                const moves = data.results;
                
                // Fetch move details with types and filter out unlearnable moves
                const movePromises = moves.map(async (move) => {
                    try {
                        const moveResponse = await fetch(move.url);
                        const moveData = await moveResponse.json();
                        
                        // Filter out moves that can't be learned by any Pokemon
                        if (!moveData.learned_by_pokemon || moveData.learned_by_pokemon.length === 0) {
                            console.log(`Filtered out unlearnable move: ${moveData.name}`);
                            return null;
                        }
                        
                        return {
                            name: moveData.name,
                            type: moveData.type.name
                        };
                    } catch (error) {
                        console.warn(`Failed to load move ${move.name}:`, error);
                        return null;
                    }
                });
                
                movesWithTypes = (await Promise.all(movePromises)).filter(move => move !== null);
                console.log(`Filtered moves: ${movesWithTypes.length} learnable moves out of ${moves.length} total moves`);
                
                // Cache the filtered results
                CACHE_UTILS.saveMovesData(movesWithTypes);
            }
            
            // Group moves by type
            const movesByType = movesWithTypes.reduce((groups, move) => {
                if (!groups[move.type]) {
                    groups[move.type] = [];
                }
                groups[move.type].push(move);
                return groups;
            }, {});
            
            // Sort types and moves
            const sortedTypes = Object.keys(movesByType).sort();
            
            document.getElementById('moves-loading').style.display = 'none';
            document.getElementById('moves-by-type-container').innerHTML = sortedTypes
                .map(type => `
                    <div class="move-type-section">
                        <h3 class="move-type-header type-${type}">${type.charAt(0).toUpperCase() + type.slice(1)} Moves</h3>
                        <div class="moves-list">
                            ${movesByType[type]
                                .sort((a, b) => a.name.localeCompare(b.name))
                                .map(move => `<span class="move-badge type-${move.type} clickable-move" data-move-name="${move.name}">${toTitleCase(move.name)}</span>`)
                                .join('')}
                        </div>
                    </div>
                `).join('');
            
            // Add click handlers for moves
            document.querySelectorAll('.clickable-move').forEach(moveElement => {
                moveElement.addEventListener('click', function() {
                    const moveName = this.dataset.moveName;
                    NavigationSystem.push({ type: 'moves' });
                    displayMoveDetails(moveName);
                });
            });
            
        } catch (error) {
            console.error('Error loading moves:', error);
            document.getElementById('moves-loading').innerHTML = '<div class="error">Error loading moves</div>';
        }
    },
    
    async showAbilitiesPage() {
        const main = document.querySelector('main');
        main.innerHTML = `
            <div class="detail-container">
                <h1 class="detail-name">All Abilities</h1>
                <div id="abilities-loading" class="loading">Loading abilities...</div>
                <div id="abilities-container" class="abilities-list"></div>
            </div>
        `;
        this.updateActiveNavItem('abilities');
        
        try {
            // Try to load from cache first
            let abilities = CACHE_UTILS.loadAbilitiesData();
            
            if (!abilities) {
                // Cache miss - fetch from API
                console.log('Fetching abilities from API...');
                const response = await fetch(`${API_URL}ability?limit=1000`);
                const data = await response.json();
                abilities = data.results;
                
                // Cache the results
                CACHE_UTILS.saveAbilitiesData(abilities);
            }
            
            document.getElementById('abilities-loading').style.display = 'none';
            
            // Group abilities alphabetically
            const groupedAbilities = {};
            abilities
                .sort((a, b) => a.name.localeCompare(b.name))
                .forEach(ability => {
                    const firstLetter = ability.name.charAt(0).toUpperCase();
                    if (!groupedAbilities[firstLetter]) {
                        groupedAbilities[firstLetter] = [];
                    }
                    groupedAbilities[firstLetter].push(ability);
                });
            
            // Render abilities with alphabet sections
            let abilitiesHTML = '';
            Object.keys(groupedAbilities).sort().forEach(letter => {
                abilitiesHTML += `<div class="alphabet-section">${letter}</div>`;
                abilitiesHTML += groupedAbilities[letter]
                    .map(ability => `<span class="ability-badge clickable-ability" data-ability-name="${ability.name}">${toTitleCase(ability.name)}</span>`)
                    .join('');
            });
            
            document.getElementById('abilities-container').innerHTML = abilitiesHTML;
            
            // Add click handlers for abilities
            document.querySelectorAll('.clickable-ability').forEach(abilityElement => {
                abilityElement.addEventListener('click', function() {
                    const abilityName = this.dataset.abilityName;
                    NavigationSystem.push({ type: 'abilities' });
                    displayAbilityDetails(abilityName);
                });
            });
            
        } catch (error) {
            console.error('Error loading abilities:', error);
            document.getElementById('abilities-loading').innerHTML = '<div class="error">Error loading abilities</div>';
        }
    },
    
    showTypesPage() {
        const main = document.querySelector('main');
        main.innerHTML = `
            <div class="detail-container">
                <h1 class="detail-name">Types</h1>
                <p class="detail-description">Types functionality will be implemented later.</p>
            </div>
        `;
        this.updateActiveNavItem('types');
    }
};


const CACHE_UTILS = {
    isExpired(timestamp) {
        const now = new Date().getTime();
        const expiryTime = CACHE_CONFIG.EXPIRY_DAYS * 24 * 60 * 60 * 1000;
        return (now - timestamp) > expiryTime;
    },

    isCacheValid() {
        const version = localStorage.getItem(CACHE_KEYS.CACHE_VERSION);
        const timestamp = localStorage.getItem(CACHE_KEYS.CACHE_TIMESTAMP);
        
        if (!version || !timestamp) return false;
        if (version !== CACHE_CONFIG.VERSION) return false;
        if (this.isExpired(parseInt(timestamp))) return false;
        
        return true;
    },

    savePokemonList(pokemonList) {
        try {
            localStorage.setItem(CACHE_KEYS.POKEMON_LIST, JSON.stringify(pokemonList));
            localStorage.setItem(CACHE_KEYS.CACHE_VERSION, CACHE_CONFIG.VERSION);
            localStorage.setItem(CACHE_KEYS.CACHE_TIMESTAMP, new Date().getTime().toString());
            console.log(`Cached ${pokemonList.length} Pokemon to localStorage`);
        } catch (error) {
            console.warn('Failed to cache Pokemon list:', error);
        }
    },

    loadPokemonList() {
        try {
            if (!this.isCacheValid()) {
                console.log('Cache invalid or expired');
                return null;
            }
            
            const cachedData = localStorage.getItem(CACHE_KEYS.POKEMON_LIST);
            if (!cachedData) return null;
            
            const pokemonList = JSON.parse(cachedData);
            console.log(`Loaded ${pokemonList.length} Pokemon from cache`);
            return pokemonList;
        } catch (error) {
            console.warn('Failed to load cached Pokemon list:', error);
            return null;
        }
    },

    clearCache() {
        localStorage.removeItem(CACHE_KEYS.POKEMON_LIST);
        localStorage.removeItem(CACHE_KEYS.POKEMON_DETAILS);
        localStorage.removeItem(CACHE_KEYS.MOVE_TYPES);
        localStorage.removeItem(CACHE_KEYS.MOVES_LIST);
        localStorage.removeItem(CACHE_KEYS.ABILITIES_LIST);
        localStorage.removeItem(CACHE_KEYS.CACHE_VERSION);
        localStorage.removeItem(CACHE_KEYS.CACHE_TIMESTAMP);
        console.log('Pokemon cache cleared');
    },

    saveMoveTypes(moveTypesMap) {
        try {
            localStorage.setItem(CACHE_KEYS.MOVE_TYPES, JSON.stringify(moveTypesMap));
            console.log(`Cached ${Object.keys(moveTypesMap).length} move types`);
        } catch (error) {
            console.warn('Failed to cache move types:', error);
        }
    },

    loadMoveTypes() {
        try {
            if (!this.isCacheValid()) return {};
            const cachedData = localStorage.getItem(CACHE_KEYS.MOVE_TYPES);
            if (!cachedData) return {};
            return JSON.parse(cachedData);
        } catch (error) {
            console.warn('Failed to load cached move types:', error);
            return {};
        }
    },

    savePokemonDetails(pokemonName, detailData) {
        try {
            let detailsCache = JSON.parse(localStorage.getItem(CACHE_KEYS.POKEMON_DETAILS) || '{}');
            detailsCache[pokemonName] = {
                data: detailData,
                timestamp: new Date().getTime()
            };
            localStorage.setItem(CACHE_KEYS.POKEMON_DETAILS, JSON.stringify(detailsCache));
            console.log(`Cached details for ${pokemonName}`);
        } catch (error) {
            console.warn('Failed to cache Pokemon details:', error);
        }
    },

    loadPokemonDetails(pokemonName) {
        try {
            const detailsCache = JSON.parse(localStorage.getItem(CACHE_KEYS.POKEMON_DETAILS) || '{}');
            const cached = detailsCache[pokemonName];
            
            if (!cached) return null;
            
            // Check if cached detail is still valid (same expiry as main cache)
            if (this.isExpired(cached.timestamp)) {
                delete detailsCache[pokemonName];
                localStorage.setItem(CACHE_KEYS.POKEMON_DETAILS, JSON.stringify(detailsCache));
                return null;
            }
            
            console.log(`Loaded cached details for ${pokemonName}`);
            return cached.data;
        } catch (error) {
            console.warn('Failed to load cached Pokemon details:', error);
            return null;
        }
    },

    saveMovesData(movesData) {
        try {
            localStorage.setItem(CACHE_KEYS.MOVES_LIST, JSON.stringify(movesData));
            console.log(`Cached ${movesData.length} moves to localStorage`);
        } catch (error) {
            console.warn('Failed to cache moves data:', error);
        }
    },

    loadMovesData() {
        try {
            if (!this.isCacheValid()) {
                console.log('Moves cache invalid or expired');
                return null;
            }
            
            const cachedData = localStorage.getItem(CACHE_KEYS.MOVES_LIST);
            if (!cachedData) return null;
            
            const movesData = JSON.parse(cachedData);
            console.log(`Loaded ${movesData.length} moves from cache`);
            return movesData;
        } catch (error) {
            console.warn('Failed to load cached moves data:', error);
            return null;
        }
    },

    saveAbilitiesData(abilitiesData) {
        try {
            localStorage.setItem(CACHE_KEYS.ABILITIES_LIST, JSON.stringify(abilitiesData));
            console.log(`Cached ${abilitiesData.length} abilities to localStorage`);
        } catch (error) {
            console.warn('Failed to cache abilities data:', error);
        }
    },

    loadAbilitiesData() {
        try {
            if (!this.isCacheValid()) {
                console.log('Abilities cache invalid or expired');
                return null;
            }
            
            const cachedData = localStorage.getItem(CACHE_KEYS.ABILITIES_LIST);
            if (!cachedData) return null;
            
            const abilitiesData = JSON.parse(cachedData);
            console.log(`Loaded ${abilitiesData.length} abilities from cache`);
            return abilitiesData;
        } catch (error) {
            console.warn('Failed to load cached abilities data:', error);
            return null;
        }
    },

    clearMovesCache() {
        try {
            localStorage.removeItem(CACHE_KEYS.MOVES_LIST);
            console.log('Moves cache cleared');
        } catch (error) {
            console.warn('Failed to clear moves cache:', error);
        }
    },

    // Debug function to clear all cache - call this from browser console
    clearAllCache() {
        this.clearCache();
        console.log('All cache cleared - refresh the page to see changes');
    }
};


/*
FETCHING FUNCTIONS
*/
async function fetchPokemonData(pokemonName, options = {}) {
    const { spriteOnly = false } = options;
    
    try {
        const response = await fetch(`${API_URL}pokemon/${pokemonName.toLowerCase()}`);
        const data = await response.json();
        
        if (spriteOnly) {
            return {
                id: data.id,
                name: data.name,
                sprite: data.sprites.front_default
            };
        }
        
        return data;
    } catch (error) {
        console.error(`Error fetching Pokémon data for ${pokemonName}:`, error);
        return null;
    }
}

async function getPokemonDetailedData(pokemonName) {
    try {
        // Check cache first - but ensure we have move types
        const cachedDetails = CACHE_UTILS.loadPokemonDetails(pokemonName);
        if (cachedDetails && cachedDetails.moves && cachedDetails.moves.length > 0 && cachedDetails.moves[0].type !== 'normal') {
            // Only use cache if moves have actual types (not default 'normal')
            return cachedDetails;
        }

        const pokemonResponse = await fetch(`${API_URL}pokemon/${pokemonName.toLowerCase()}`);
        const pokemonData = await pokemonResponse.json();
        
        // Try to get species data from the pokemon data's species URL
        let description = 'No description available.';
        try {
            const speciesResponse = await fetch(pokemonData.species.url);
            const speciesData = await speciesResponse.json();
            
            // Get English flavor text entries and prioritize recent versions
            const englishEntries = speciesData.flavor_text_entries.filter(entry => entry.language.name === 'en');
            
            // Prefer newer game versions (they tend to have better descriptions)
            const preferredVersions = ['shield', 'sword', 'ultra-moon', 'ultra-sun', 'moon', 'sun', 'alpha-sapphire', 'omega-ruby'];
            let selectedEntry = null;
            
            // Try to find entry from preferred versions first
            for (const version of preferredVersions) {
                selectedEntry = englishEntries.find(entry => entry.version.name === version);
                if (selectedEntry) break;
            }
            
            // If no preferred version found, use the last available entry (usually most recent)
            if (!selectedEntry && englishEntries.length > 0) {
                selectedEntry = englishEntries[englishEntries.length - 1];
            }
            
            description = selectedEntry ? cleanText(selectedEntry.flavor_text) : 'No description available.';
        } catch (speciesError) {
            console.warn(`Could not fetch species data for ${pokemonName}:`, speciesError);
        }
        
        // Fetch move names and their types efficiently
        const moveNames = pokemonData.moves.map(move => move.move.name);
        const movesWithTypes = await getMoveTypesForPokemon(moveNames);
        
        const detailData = {
            id: pokemonData.id,
            name: pokemonData.name,
            height: pokemonData.height,
            weight: pokemonData.weight,
            types: pokemonData.types.map(type => type.type.name),
            abilities: pokemonData.abilities.map(ability => ability.ability.name),
            stats: pokemonData.stats.map(stat => ({
                name: stat.stat.name,
                value: stat.base_stat
            })),
            moves: movesWithTypes,
            sprites: pokemonData.sprites,
            description: description
        };

        // Cache the result
        CACHE_UTILS.savePokemonDetails(pokemonName, detailData);
        
        return detailData;
    } catch (error) {
        console.error("Error fetching detailed Pokémon data:", error);
        return null;
    }
}

async function getMoveTypesForPokemon(moveNames) {
    console.log(`Getting move types for ${moveNames.length} moves`);
    const cachedMoveTypes = CACHE_UTILS.loadMoveTypes();
    console.log(`Found ${Object.keys(cachedMoveTypes).length} cached move types`);
    
    const movesWithTypes = [];
    const movesToFetch = [];
    
    // Check cache first and identify which moves need to be fetched
    for (const moveName of moveNames) {
        if (cachedMoveTypes[moveName]) {
            movesWithTypes.push({
                name: moveName,
                type: cachedMoveTypes[moveName]
            });
        } else {
            movesToFetch.push(moveName);
        }
    }
    
    console.log(`Need to fetch ${movesToFetch.length} new move types`);
    
    // Fetch uncached move types
    if (movesToFetch.length > 0) {
        console.log(`Fetching types for moves: ${movesToFetch.slice(0, 5).join(', ')}${movesToFetch.length > 5 ? '...' : ''}`);
        
        const fetchPromises = movesToFetch.map(async (moveName) => {
            try {
                const response = await fetch(`${API_URL}move/${moveName.toLowerCase()}`);
                const data = await response.json();
                console.log(`${moveName} -> ${data.type.name}`);
                return {
                    name: moveName,
                    type: data.type.name
                };
            } catch (error) {
                console.error(`Error fetching move ${moveName}:`, error);
                return { name: moveName, type: 'normal' };
            }
        });
        
        const fetchedMoves = await Promise.all(fetchPromises);
        
        // Add fetched moves to results and cache
        for (const move of fetchedMoves) {
            movesWithTypes.push(move);
            cachedMoveTypes[move.name] = move.type;
        }
        
        // Update cache with new move types
        CACHE_UTILS.saveMoveTypes(cachedMoveTypes);
        console.log(`Cached ${fetchedMoves.length} new move types`);
    }
    
    console.log(`Returning ${movesWithTypes.length} moves with types`);
    return movesWithTypes;
}

async function fetchMoveData(moveName) {
    try {
        const response = await fetch(`${API_URL}move/${moveName.toLowerCase()}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const moveData = await response.json();
        return moveData;
    } catch (error) {
        console.error(`Error fetching move data for ${moveName}:`, error);
        return null;
    }
}


async function fetchAbilityData(abilityName) {
    try {
        const response = await fetch(`${API_URL}ability/${abilityName.toLowerCase()}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const abilityData = await response.json();
        return abilityData;
    } catch (error) {
        console.error(`Error fetching ability data for ${abilityName}:`, error);
        return null;
    }
}

async function fetchAndCachePokemonData() {
    // Get all Pokemon names
    const response = await fetch(`${API_URL}pokemon?limit=${POKEMON_LIMITS.TOTAL}`);
    const data = await response.json();
    const allPokemonNames = data.results;
    
    // Process first generation first for faster initial load
    const firstGeneration = allPokemonNames.slice(0, POKEMON_LIMITS.FIRST_GENERATION);
    const firstGenerationPromises = firstGeneration.map(pokemon => 
        fetchPokemonData(pokemon.name, { spriteOnly: true })
    );
    
    console.log('Loading first 151 Pokemon...');
    const firstGenerationResults = await Promise.all(firstGenerationPromises);
    const validFirstGeneration = firstGenerationResults.filter(isValidPokemon);
    
    // Process remaining Pokemon
    const remainingPokemon = allPokemonNames.slice(POKEMON_LIMITS.FIRST_GENERATION);
    const remainingPromises = remainingPokemon.map(pokemon => 
        fetchPokemonData(pokemon.name, { spriteOnly: true })
    );
    
    console.log('Loading remaining Pokemon...');
    const remainingResults = await Promise.all(remainingPromises);
    const validRemaining = remainingResults.filter(isValidPokemon);
    
    // Combine all valid Pokemon data
    const allPokemonData = [...validFirstGeneration, ...validRemaining];
    
    // Cache the complete dataset
    CACHE_UTILS.savePokemonList(allPokemonData);
    
    return allPokemonData;
}


/* 
SEARCH AND SORT FUNCTIONS
*/
async function loadPokemonThatLearnMove(learnedByList, moveName) {
    const bannersContainer = document.getElementById('pokemon-banners');
    
    if (!learnedByList || learnedByList.length === 0) {
        bannersContainer.innerHTML = '<p>No Pokemon data available.</p>';
        return;
    }
    
    bannersContainer.innerHTML = 'Loading Pokemon...';
    
    try {
        const limitedList = learnedByList;
        const pokemonPromises = limitedList.map(async (pokemon) => {
            try {
                const pokemonData = await fetchPokemonData(pokemon.name, { spriteOnly: true });
                return pokemonData;
            } catch (error) {
                console.warn(`Failed to load ${pokemon.name}:`, error);
                return null;
            }
        });
        
        const pokemonResults = await Promise.all(pokemonPromises);
        const validPokemon = pokemonResults.filter(isValidPokemon);
        
        if (validPokemon.length === 0) {
            bannersContainer.innerHTML = '<p>Could not load Pokemon data.</p>';
            return;
        }
        
        bannersContainer.innerHTML = validPokemon
            .map(pokemon => createPokemonBanner(pokemon))
            .join('');
            
        // Add click handlers for Pokemon banners
        document.querySelectorAll('.pokemon-banner').forEach(banner => {
            banner.addEventListener('click', async function() {
                const pokemonName = this.dataset.pokemonName;
                const detailedPokemon = await getPokemonDetailedData(pokemonName);
                if (detailedPokemon) {
                    // Push current move page to navigation stack
                    NavigationSystem.push({ type: 'move', data: moveName });
                    displayPokemonDetail(detailedPokemon);
                }
            });
        });
        
    } catch (error) {
        bannersContainer.innerHTML = '<p>Error loading Pokemon data.</p>';
    }
}

async function loadPokemonWithAbility(pokemonList, abilityName) {
    const bannersContainer = document.getElementById('pokemon-banners');
    
    if (!pokemonList || pokemonList.length === 0) {
        bannersContainer.innerHTML = '<p>No Pokemon data available.</p>';
        return;
    }
    
    bannersContainer.innerHTML = 'Loading Pokemon...';
    
    try {
        const limitedList = pokemonList;
        const pokemonPromises = limitedList.map(async (pokemonEntry) => {
            try {
                const pokemonData = await fetchPokemonData(pokemonEntry.pokemon.name, { spriteOnly: true });
                return pokemonData;
            } catch (error) {
                console.warn(`Failed to load ${pokemonEntry.pokemon.name}:`, error);
                return null;
            }
        });
        
        const pokemonResults = await Promise.all(pokemonPromises);
        const validPokemon = pokemonResults.filter(isValidPokemon);
        
        if (validPokemon.length === 0) {
            bannersContainer.innerHTML = '<p>Could not load Pokemon data.</p>';
            return;
        }
        
        bannersContainer.innerHTML = validPokemon
            .map(pokemon => createPokemonBanner(pokemon))
            .join('');
            
        // Add click handlers for Pokemon banners
        document.querySelectorAll('.pokemon-banner').forEach(banner => {
            banner.addEventListener('click', async function() {
                const pokemonName = this.dataset.pokemonName;
                const detailedPokemon = await getPokemonDetailedData(pokemonName);
                if (detailedPokemon) {
                    // Push current ability page to navigation stack
                    NavigationSystem.push({ type: 'ability', data: abilityName });
                    displayPokemonDetail(detailedPokemon);
                }
            });
        });
        
    } catch (error) {
        console.error('Error loading Pokemon with this ability:', error);
        bannersContainer.innerHTML = '<p>Error loading Pokemon data.</p>';
    }
}

function setupSearchFunctionality() {
    const searchInput = document.getElementById('pokemon-input');
    const searchButton = document.getElementById('search-button');
    
    if (searchInput && searchButton) {
        // Search on button click
        searchButton.addEventListener('click', performSearch);
        
        // Search on Enter key press
        searchInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                performSearch();
            }
        });
    }
}

function setupSortingFunctionality() {
    const sortSelect = document.getElementById('sort-select');
    const generationFilter = document.getElementById('generation-filter');
    
    if (sortSelect && generationFilter) {
        sortSelect.addEventListener('change', applySorting);
        generationFilter.addEventListener('change', applySorting);
    }
}

function filterPokemonByGeneration(pokemonList, generation) {
    if (generation === 'all') return pokemonList;
    
    const range = GENERATION_RANGES[generation];
    
    if (!range) return pokemonList;
    
    return pokemonList.filter(pokemon => {
        const id = pokemon.id || parseInt(pokemon.name.match(/\d+/)) || 0;
        return id >= range.min && id <= range.max;
    });
}

function sortPokemon(pokemonList, sortType) {
    const sorted = [...pokemonList];
    
    switch (sortType) {
        case 'id-asc':
            return sorted.sort((a, b) => {
                const idA = a.id || parseInt(a.name.match(/\d+/)) || 0;
                const idB = b.id || parseInt(b.name.match(/\d+/)) || 0;
                return idA - idB;
            });
            
        case 'id-desc':
            return sorted.sort((a, b) => {
                const idA = a.id || parseInt(a.name.match(/\d+/)) || 0;
                const idB = b.id || parseInt(b.name.match(/\d+/)) || 0;
                return idB - idA;
            });
            
        case 'name-asc':
            return sorted.sort((a, b) => a.name.localeCompare(b.name));
            
        case 'name-desc':
            return sorted.sort((a, b) => b.name.localeCompare(a.name));
            
        default:
            return sorted;
    }
}

async function applySorting() {
    const sortSelect = document.getElementById('sort-select');
    const generationFilter = document.getElementById('generation-filter');
    const pokemonDisplay = document.getElementById('pokemon-display');
    
    if (!sortSelect || !generationFilter || !pokemonDisplay) return;
    
    const sortType = sortSelect.value;
    const generation = generationFilter.value;
    
    // Check if we're currently showing search results
    const searchResultsHeader = document.querySelector('.search-results-header');
    const isSearchActive = searchResultsHeader !== null;
    
    // Show loading state
    pokemonDisplay.innerHTML = '<div class="loading">Applying filters...</div>';
    
    try {
        let pokemonToSort;
        
        if (isSearchActive) {
            // If we're in search mode, get the search term and perform search again
            const searchTerm = document.getElementById('pokemon-input').value.trim().toLowerCase();
            if (searchTerm) {
                // Perform the search to get current results
                pokemonToSort = await getCurrentSearchResults(searchTerm);
            } else {
                // No search term, fall back to all Pokemon
                let allPokemonData = CACHE_UTILS.loadPokemonList();
                if (!allPokemonData) {
                    allPokemonData = await fetchAndCachePokemonData();
                }
                pokemonToSort = allPokemonData;
            }
        } else {
            // Normal mode - get all Pokemon data
            let allPokemonData = CACHE_UTILS.loadPokemonList();
            if (!allPokemonData) {
                allPokemonData = await fetchAndCachePokemonData();
            }
            pokemonToSort = allPokemonData;
        }
        
        // Apply generation filter
        let filteredPokemon = filterPokemonByGeneration(pokemonToSort, generation);
        
        // Apply sorting
        filteredPokemon = sortPokemon(filteredPokemon, sortType);
        
        // Display results with appropriate header
        if (isSearchActive && document.getElementById('pokemon-input').value.trim()) {
            displaySortedSearchResults(filteredPokemon, document.getElementById('pokemon-input').value.trim());
        } else {
            displaySortedPokemon(filteredPokemon);
        }
        
    } catch (error) {
        console.error('Error applying sorting:', error);
        pokemonDisplay.innerHTML = '<div class="error">Error applying filters</div>';
    }
}

async function getCurrentSearchResults(searchTerm) {
    // This function replicates the search logic to get current search results
    try {
        // First try to find exact match
        const exactMatch = await fetchPokemonData(searchTerm, { spriteOnly: true });
        if (exactMatch && exactMatch.sprite) {
            return [exactMatch];
        }
    } catch (error) {
        // Not an exact match, continue with partial search
    }
    
    // Partial search through all Pokemon names
    try {
        const response = await fetch(`${API_URL}pokemon?limit=${POKEMON_LIMITS.TOTAL}`);
        const data = await response.json();
        const allPokemonNames = data.results;
        
        const matchingPokemon = allPokemonNames.filter(pokemon => 
            pokemon.name.toLowerCase().includes(searchTerm)
        );
        
        const limitedMatches = matchingPokemon.slice(0, POKEMON_LIMITS.SEARCH_RESULTS);
        
        const promises = [];
        for (const pokemon of limitedMatches) {
            promises.push(
                fetchPokemonData(pokemon.name, { spriteOnly: true })
                    .then(pokemonData => pokemonData && pokemonData.sprite ? pokemonData : null)
                    .catch(() => null)
            );
        }
        
        const results = await Promise.all(promises);
        return results.filter(pokemon => pokemon !== null);
    } catch (error) {
        console.error('Error getting current search results:', error);
        return [];
    }
}


async function searchByPokemonName(searchTerm) {
    try {
        const pokemonDisplay = document.getElementById('pokemon-display');
        pokemonDisplay.innerHTML = '<div class="loading">Searching...</div>';
        
        // First try exact match
        try {
            const pokemon = await fetchPokemonData(searchTerm);
            if (pokemon) {
                const pokemonWithSprite = {
                    id: pokemon.id,
                    name: pokemon.name,
                    sprite: pokemon.sprites.front_default
                };
                displaySearchResults([pokemonWithSprite]);
                return;
            }
        } catch (error) {
        }
        
        // Try to search through cached data first
        let searchResults = [];
        const cachedPokemon = CACHE_UTILS.loadPokemonList();
        
        if (cachedPokemon) {
            console.log('Searching through cached Pokemon data');
            searchResults = cachedPokemon.filter(pokemon => 
                pokemon.name.toLowerCase().includes(searchTerm)
            ).slice(0, POKEMON_LIMITS.SEARCH_RESULTS);
        } else {
            console.log('No cache available, searching via API');
            // Fallback to API search
            const response = await fetch(`${API_URL}pokemon?limit=${POKEMON_LIMITS.TOTAL}`);
            const data = await response.json();
            const allPokemonNames = data.results;
            
            const matchingPokemon = allPokemonNames.filter(pokemon => 
                pokemon.name.toLowerCase().includes(searchTerm)
            );
            
            const limitedMatches = matchingPokemon.slice(0, POKEMON_LIMITS.SEARCH_RESULTS);
            
            const promises = [];
            for (const pokemon of limitedMatches) {
                promises.push(
                    fetchPokemonData(pokemon.name, { spriteOnly: true })
                        .then(pokemonData => pokemonData && pokemonData.sprite ? pokemonData : null)
                        .catch(() => null)
                );
            }
            
            const pokemonResults = await Promise.all(promises);
            searchResults = pokemonResults.filter(pokemon => pokemon);
        }
        
        if (searchResults.length > 0) {
            // Sort results by relevance (exact matches first, then by length)
            searchResults.sort((a, b) => {
                const aName = a.name.toLowerCase();
                const bName = b.name.toLowerCase();
                
                if (aName === searchTerm && bName !== searchTerm) return -1;
                if (bName === searchTerm && aName !== searchTerm) return 1;
                if (aName.startsWith(searchTerm) && !bName.startsWith(searchTerm)) return -1;
                if (bName.startsWith(searchTerm) && !aName.startsWith(searchTerm)) return 1;
                
                return aName.length - bName.length;
            });
            
            displaySearchResults(searchResults);
        } else {
            pokemonDisplay.innerHTML = '<div class="error">No Pokemon found matching your search</div>';
        }
    } catch (error) {
        console.error('Error searching by name:', error);
        document.getElementById('pokemon-display').innerHTML = '<div class="error">Error searching for Pokemon</div>';
    }
}

/* 
DISPLAY FUNCTIONS
*/
function createPokemonCard(pokemon, showId = false) {
    const card = document.createElement('div');
    card.className = 'pokemon-card';
    card.style.cursor = 'pointer';
    
    const formattedName = formatPokemonDisplayName(pokemon.name);
    const idDisplay = showId ? `<p>#${pokemon.id.toString().padStart(3, '0')}</p>` : '';
    
    card.innerHTML = `
        <img src="${pokemon.sprite}" alt="${pokemon.name}" class="pokemon-sprite" loading="lazy">
        <h3 class="pokemon-name">${formattedName}</h3>
        ${idDisplay}
    `;
    
    card.addEventListener('click', async function() {
        try {
            // Show loading state immediately
            const main = document.querySelector('main');
            main.innerHTML = `
                <div class="loading" style="min-height: 200px; display: flex; align-items: center; justify-content: center;">
                    <div>
                        <h2>Loading ${formatPokemonDisplayName(pokemon.name)}...</h2>
                        <p>Fetching Pokemon details...</p>
                    </div>
                </div>
            `;
            
            const baseName = getBasePokemonName(pokemon.name);
            const detailedData = await getPokemonDetailedData(baseName);
            if (detailedData) {
                // Push current page to navigation stack
                NavigationSystem.push({ type: 'home' });
                displayPokemonDetail(detailedData);
            }
        } catch (error) {
            console.error('Error displaying Pokemon details:', error);
            const main = document.querySelector('main');
            main.innerHTML = `
                <div class="error">
                    ${NavigationSystem.createNavigationBar()}
                    <h2>Error Loading Pokemon</h2>
                    <p>Sorry, there was an error loading the Pokemon details. Please try again.</p>
                </div>
            `;
            NavigationSystem.setupNavigationListeners();
        }
    });
    
    return card;
}

function createRadarChart(stats) {
    const size = 300;
    const center = size / 2;
    const maxRadius = 120;
    
    // Stat names in order for the hexagon
    const statOrder = ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed'];
    const statLabels = ['HP', 'ATK', 'DEF', 'SP.ATK', 'SP.DEF', 'SPD'];
    
    // Calculate points for hexagon (6 stats = 6 points)
    const angles = statOrder.map((_, i) => (i * Math.PI * 2) / 6 - Math.PI / 2);
    
    // Create the stat points
    const statPoints = statOrder.map((statName, i) => {
        const stat = stats.find(s => s.name === statName);
        const value = stat ? stat.value : 0;
        const radius = (value / 255) * maxRadius; // Scale to max radius
        const angle = angles[i];
        
        return {
            x: center + Math.cos(angle) * radius,
            y: center + Math.sin(angle) * radius,
            value: value,
            label: statLabels[i]
        };
    });
    
    // Create hexagon grid lines (background)
    const gridLines = [0.2, 0.4, 0.6, 0.8, 1.0].map(scale => {
        const points = angles.map(angle => {
            const x = center + Math.cos(angle) * maxRadius * scale;
            const y = center + Math.sin(angle) * maxRadius * scale;
            return `${x},${y}`;
        }).join(' ');
        return `<polygon points="${points}" fill="none" stroke="#333" stroke-width="1" opacity="0.3"/>`;
    }).join('');
    
    // Create axis lines
    const axisLines = angles.map(angle => {
        const x2 = center + Math.cos(angle) * maxRadius;
        const y2 = center + Math.sin(angle) * maxRadius;
        return `<line x1="${center}" y1="${center}" x2="${x2}" y2="${y2}" stroke="#333" stroke-width="1" opacity="0.3"/>`;
    }).join('');
    
    // Create the stat polygon
    const statPolygonPoints = statPoints.map(point => `${point.x},${point.y}`).join(' ');
    
    // Create stat labels
    const labels = statOrder.map((statName, i) => {
        const angle = angles[i];
        const labelRadius = maxRadius + 20;
        const x = center + Math.cos(angle) * labelRadius;
        const y = center + Math.sin(angle) * labelRadius;
        const stat = stats.find(s => s.name === statName);
        const value = stat ? stat.value : 0;
        
        return `
            <text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle" fill="#fff" font-size="14" font-weight="bold">
                ${statLabels[i]}
            </text>
            <text x="${x}" y="${y + 18}" text-anchor="middle" dominant-baseline="middle" fill="#ccc" font-size="12">
                ${value}
            </text>
        `;
    }).join('');
    
    return `
        <svg width="${size + 40}" height="${size + 40}" viewBox="0 0 ${size + 40} ${size + 40}">
            <g transform="translate(20, 20)">
                ${gridLines}
                ${axisLines}
                <polygon points="${statPolygonPoints}" fill="#007bff" fill-opacity="0.3" stroke="#007bff" stroke-width="2"/>
                ${statPoints.map(point => `<circle cx="${point.x}" cy="${point.y}" r="3" fill="#007bff"/>`).join('')}
                ${labels}
            </g>
        </svg>
    `;
}

async function displayMoveDetails(moveName) {
    const main = document.querySelector('main');
    
    try {
        const moveData = await fetchMoveData(moveName);
        if (!moveData) {
            main.innerHTML = `
                <div id="move-detail">
                    ${NavigationSystem.createNavigationBar()}
                    <h1>Move not found</h1>
                    <p>Sorry, we couldn't load the details for "${moveName}".</p>
                </div>
            `;
            NavigationSystem.setupNavigationListeners();
            return;
        }

        const englishEffect = findEnglishEntry(moveData.effect_entries);
        let description = getDescriptionFromEntry(englishEffect, 'effect', null);
        
        // If no effect description is available, try flavor text
        if (!description || description === 'No effect description available.' || description === null) {
            const englishFlavorText = findEnglishEntry(moveData.flavor_text_entries);
            description = getDescriptionFromEntry(englishFlavorText, 'flavor_text', 'No description available.');
        }
        
        const formattedName = toTitleCase(moveName);
        const damageClass = moveData.damage_class.name;
        const type = moveData.type.name;
        const accuracy = moveData.accuracy ? moveData.accuracy : 'N/A';
        const power = moveData.power ? moveData.power : 'N/A';
        
        main.innerHTML = `
            <div id="move-detail">
                ${NavigationSystem.createNavigationBar()}
                
                <div class="detail-container">
                    <div class="detail-header">
                        <div class="detail-info">
                            <h1 class="detail-name">${formattedName}</h1>
                            <div class="move-stats">
                                <span class="type-badge type-${type}">${type.charAt(0).toUpperCase() + type.slice(1)}</span>
                                <span class="damage-class-badge ${damageClass}">${damageClass.charAt(0).toUpperCase() + damageClass.slice(1)}</span>
                            </div>
                            <div class="move-details">
                                <div class="move-stat">
                                    <span class="stat-label">Power:</span>
                                    <span class="stat-value">${power}</span>
                                </div>
                                <div class="move-stat">
                                    <span class="stat-label">Accuracy:</span>
                                    <span class="stat-value">${accuracy}${accuracy !== 'N/A' ? '%' : ''}</span>
                                </div>
                                <div class="move-stat">
                                    <span class="stat-label">PP:</span>
                                    <span class="stat-value">${moveData.pp}</span>
                                </div>
                            </div>
                            <p class="detail-description">${description}</p>
                        </div>
                    </div>
                    
                    <div class="learned-by-section">
                        <h3>Pokemon that can learn this move</h3>
                        <div id="pokemon-banners" class="pokemon-banners">
                            Loading...
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Setup navigation listeners
        NavigationSystem.setupNavigationListeners();
        
        // Load Pokemon that can learn this move
        loadPokemonThatLearnMove(moveData.learned_by_pokemon, moveName);
        
    } catch (error) {
        console.error('Error displaying move details:', error);
        main.innerHTML = `
            <div id="move-detail">
                ${NavigationSystem.createNavigationBar()}
                <h1>Error loading move</h1>
                <p>There was an error loading the move details.</p>
            </div>
        `;
        NavigationSystem.setupNavigationListeners();
    }
}

function displayPokemonDetail(pokemon) {
    const main = document.querySelector('main');
    const formattedName = pokemon.name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    
    main.innerHTML = `
        <div id="pokemon-detail">
            ${NavigationSystem.createNavigationBar()}
            
            <div class="detail-container">
                <div class="detail-header">
                    <div class="detail-images">
                        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" class="detail-sprite-large">
                    </div>
                    <div class="detail-info">
                        <h1 class="detail-name">#${pokemon.id} ${formattedName}</h1>
                        <div class="detail-types">
                            ${pokemon.types.map(type => `<span class="type-badge type-${type}">${type.charAt(0).toUpperCase() + type.slice(1)}</span>`).join('')}
                            <span class="stat-label">Height:</span>
                            <span class="stat-value">${(pokemon.height / 10).toFixed(1)} m</span>
                            <span class="stat-label">Weight:</span>
                            <span class="stat-value">${(pokemon.weight / 10).toFixed(1)} kg</span>
                        </div>
                        <p class="detail-description">${pokemon.description}</p>
                    </div>
                </div>
                
                <div class="detail-stats">
                    <h3>Base Stats</h3>
                    <div class="radar-chart-container">
                        ${createRadarChart(pokemon.stats)}
                    </div>
                </div>
                
                <div class="detail-abilities">
                    <h3>Abilities</h3>
                    <div class="abilities-list">
                        ${pokemon.abilities.map(ability => `<span class="ability-badge clickable-ability" data-ability-name="${ability}">${toTitleCase(ability)}</span>`).join('')}
                    </div>
                </div>
                
                <div class="detail-moves">
                    <h3>Moves</h3>
                    <div class="moves-by-type">
                        ${(() => {
                            // Group moves by type
                            const movesByType = pokemon.moves.reduce((groups, move) => {
                                const type = move.type;
                                if (!groups[type]) {
                                    groups[type] = [];
                                }
                                groups[type].push(move);
                                return groups;
                            }, {});
                            
                            // Sort type names alphabetically and create subsections
                            return Object.keys(movesByType)
                                .sort()
                                .map(type => `
                                    <div class="move-type-section">
                                        <h4 class="move-type-header type-${type}">${type.charAt(0).toUpperCase() + type.slice(1)}</h4>
                                        <div class="moves-list">
                                            ${movesByType[type]
                                                .map(move => `<span class="move-badge type-${move.type} clickable-move" data-move-name="${move.name}">${toTitleCase(move.name)}</span>`)
                                                .join('')}
                                        </div>
                                    </div>
                                `).join('');
                        })()}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Setup navigation listeners
    NavigationSystem.setupNavigationListeners();

    // Add click handlers for moves
    document.querySelectorAll('.clickable-move').forEach(moveElement => {
        moveElement.addEventListener('click', function() {
            const moveName = this.dataset.moveName;
            // Push current Pokemon page to navigation stack
            NavigationSystem.push({ type: 'pokemon', data: pokemon.name });
            displayMoveDetails(moveName);
        });
    });

    // Add click handlers for abilities
    document.querySelectorAll('.clickable-ability').forEach(abilityElement => {
        abilityElement.addEventListener('click', function() {
            const abilityName = this.dataset.abilityName;
            // Push current Pokemon page to navigation stack
            NavigationSystem.push({ type: 'pokemon', data: pokemon.name });
            displayAbilityDetails(abilityName);
        });
    });
}


function createPokemonBanner(pokemon) {
    const displayName = formatPokemonDisplayName(pokemon.name);
    // Handle both sprite-only format and full format
    const spriteUrl = pokemon.sprite || (pokemon.sprites && pokemon.sprites.front_default) || '';
    
    return `
        <div class="pokemon-banner" data-pokemon-name="${pokemon.name}">
            ${spriteUrl ? `<img src="${spriteUrl}" alt="${pokemon.name}" class="banner-sprite">` : '<div class="banner-sprite-placeholder"></div>'}
            <span class="banner-name">${displayName}</span>
        </div>
    `;
}

async function displayAbilityDetails(abilityName) {
    const main = document.querySelector('main');
    
    try {
        const abilityData = await fetchAbilityData(abilityName);
        if (!abilityData) {
            main.innerHTML = `
                <div id="ability-detail">
                    ${NavigationSystem.createNavigationBar()}
                    <h1>Ability not found</h1>
                    <p>Sorry, we couldn't load the details for "${abilityName}".</p>
                </div>
            `;
            NavigationSystem.setupNavigationListeners();
            return;
        }

        // Get detailed effect description
        const englishEffect = findEnglishEntry(abilityData.effect_entries);
        const description = getDescriptionFromEntry(englishEffect, 'effect', 'No effect description available.');
        
        const formattedName = toTitleCase(abilityName);
        
        main.innerHTML = `
            <div id="ability-detail">
                ${NavigationSystem.createNavigationBar()}
                
                <div class="detail-container">
                    <div class="detail-header">
                        <div class="detail-info">
                            <h1 class="detail-name">${formattedName}</h1>
                            <p class="detail-description">${description}</p>
                        </div>
                    </div>
                    
                    <div class="learned-by-section">
                        <h3>Pokemon with this ability</h3>
                        <div id="pokemon-banners" class="pokemon-banners">
                            Loading...
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Setup navigation listeners
        NavigationSystem.setupNavigationListeners();
        
        // Load Pokemon that have this ability
        loadPokemonWithAbility(abilityData.pokemon, abilityName);
        
    } catch (error) {
        console.error('Error displaying ability details:', error);
        main.innerHTML = `
            <div id="ability-detail">
                ${NavigationSystem.createNavigationBar()}
                <h1>Error loading ability</h1>
                <p>There was an error loading the ability details.</p>
            </div>
        `;
        NavigationSystem.setupNavigationListeners();
    }
}
async function displayAllPokemon() {
    const displayDiv = document.getElementById('pokemon-display');
    displayDiv.innerHTML = `<div class="pokemon-grid" id="pokemon-grid"></div>`;
    
    const pokemonGrid = document.getElementById('pokemon-grid');
    
    try {
        // Try to load from cache first
        let allPokemonData = CACHE_UTILS.loadPokemonList();
        
        if (allPokemonData) {
            // Use cached data
            console.log('Using cached Pokemon data');
            displayPokemonFromCache(allPokemonData, pokemonGrid);
        } else {
            // Fetch fresh data and cache it
            console.log('Fetching fresh Pokemon data from API');
            allPokemonData = await fetchAndCachePokemonData();
            displayPokemonFromCache(allPokemonData, pokemonGrid);
        }
        
    } catch (error) {
        console.error("Error displaying all Pokemon:", error);
        displayDiv.innerHTML = '<div class="error">Failed to load Pokemon. Please try refreshing the page.</div>';
    }
}

function displayPokemonFromCache(pokemonData, pokemonGrid) {
    // Display first generation immediately
    const firstGeneration = pokemonData.slice(0, POKEMON_LIMITS.FIRST_GENERATION);
    firstGeneration.forEach(pokemon => {
        pokemonGrid.appendChild(createPokemonCard(pokemon));
    });
    
    // Add remaining Pokemon with a small delay for better UX
    const remaining = pokemonData.slice(POKEMON_LIMITS.FIRST_GENERATION);
    
    // Use requestAnimationFrame for smooth rendering
    let index = 0;
    const batchSize = 50; // Process 50 Pokemon at a time
    
    function addNextBatch() {
        const endIndex = Math.min(index + batchSize, remaining.length);
        
        for (let i = index; i < endIndex; i++) {
            pokemonGrid.appendChild(createPokemonCard(remaining[i]));
        }
        
        index = endIndex;
        
        if (index < remaining.length) {
            requestAnimationFrame(addNextBatch);
        } else {
            console.log(`Displayed all ${pokemonData.length} Pokemon`);
        }
    }
    
    if (remaining.length > 0) {
        requestAnimationFrame(addNextBatch);
    }
}

function displaySortedPokemon(pokemonList) {
    const pokemonDisplay = document.getElementById('pokemon-display');
    pokemonDisplay.innerHTML = `<div class="pokemon-grid" id="pokemon-grid"></div>`;
    
    const pokemonGrid = document.getElementById('pokemon-grid');
    
    // Add count information
    const countInfo = document.createElement('div');
    countInfo.className = 'results-count';
    countInfo.textContent = `Showing ${pokemonList.length} Pokemon`;
    pokemonDisplay.insertBefore(countInfo, pokemonGrid);
    
    // Use the same batch rendering as the main display
    let index = 0;
    const batchSize = 50;
    
    function addNextBatch() {
        const endIndex = Math.min(index + batchSize, pokemonList.length);
        
        for (let i = index; i < endIndex; i++) {
            pokemonGrid.appendChild(createPokemonCard(pokemonList[i]));
        }
        
        index = endIndex;
        
        if (index < pokemonList.length) {
            requestAnimationFrame(addNextBatch);
        }
    }
    
    addNextBatch();
}


function displaySortedSearchResults(pokemonList, searchTerm) {
    const pokemonDisplay = document.getElementById('pokemon-display');
    pokemonDisplay.innerHTML = `
        <button id="back-button">← Back to All Pokemon</button>
        <div class="search-results-header">
            <h2>Search Results for "${searchTerm}" (${pokemonList.length} found)</h2>
        </div>
        <div class="pokemon-grid" id="pokemon-grid"></div>
    `;
    
    const pokemonGrid = document.getElementById('pokemon-grid');
    
    document.getElementById('back-button').addEventListener('click', function() {
        document.getElementById('pokemon-input').value = '';
        NavigationSystem.showHomePage();
    });
    
    pokemonList.forEach(pokemon => {
        pokemonGrid.appendChild(createPokemonCard(pokemon, true));
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // Setup top navigation listeners
    NavigationSystem.setupTopNavigationListeners();
    // Use the NavigationSystem to show the home page with sorting controls
    NavigationSystem.showHomePage();
});

// Global function for debugging - clear cache from browser console
window.clearPokeCache = function() {
    CACHE_UTILS.clearAllCache();
};

function performSearch() {
    const searchTerm = document.getElementById('pokemon-input').value.trim().toLowerCase();
    
    if (searchTerm === '') {
        displayAllPokemon();
        return;
    }
    
    searchByPokemonName(searchTerm);
}


function displaySearchResults(pokemonList) {
    const pokemonDisplay = document.getElementById('pokemon-display');
    pokemonDisplay.innerHTML = `
        <button id="back-button">← Back to All Pokemon</button>
        <div class="search-results-header">
            <h2>Search Results (${pokemonList.length} found)</h2>
        </div>
        <div class="pokemon-grid" id="pokemon-grid"></div>
    `;
    
    const pokemonGrid = document.getElementById('pokemon-grid');
    
    document.getElementById('back-button').addEventListener('click', function() {
        document.getElementById('pokemon-input').value = '';
        NavigationSystem.showHomePage();
    });
    
    pokemonList.forEach(pokemon => {
        pokemonGrid.appendChild(createPokemonCard(pokemon, true));
    });
}
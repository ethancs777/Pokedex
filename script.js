const API_URL = "https://pokeapi.co/api/v2/";

const CACHE_KEYS = {
    POKEMON_LIST: 'pokemon_list_cache',
    CACHE_VERSION: 'pokemon_cache_version',
    CACHE_TIMESTAMP: 'pokemon_cache_timestamp'
};

const CACHE_CONFIG = {
    VERSION: '1.0',
    EXPIRY_DAYS: 7 // Cache expires after 7 days
};

const POKEMON_LIMITS = {
    TOTAL: 1302,
    FIRST_GENERATION: 151,
    SEARCH_RESULTS: 20,
    MIN_SEARCH_LENGTH: 2,
    MIN_ERROR_LENGTH: 3
};

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
    
    goBack() {
        if (this.canGoBack()) {
            const previousPage = this.pop();
            if (previousPage.type === 'home') {
                this.showHomePage();
            } else if (previousPage.type === 'pokemon') {
                this.showPokemonDetail(previousPage.data);
            } else if (previousPage.type === 'move') {
                displayMoveDetails(previousPage.data);
            }
        } else {
            // Default fallback to home
            this.showHomePage();
        }
    },
    
    showHomePage() {
        const main = document.querySelector('main');
        main.innerHTML = `
            <div id="search">
                <input type="text" id="pokemon-input" placeholder="Enter Pokemon name or ID">
                <button id="search-button">Search</button>
            </div>
            <div id="pokemon-display"></div>
        `;
        displayAllPokemon();
        setupSearchFunctionality();
    },
    
    async showPokemonDetail(pokemonName) {
        const detailedPokemon = await getPokemonDetailedData(pokemonName);
        if (detailedPokemon) {
            displayPokemonDetail(detailedPokemon);
        }
    }
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
        localStorage.removeItem(CACHE_KEYS.CACHE_VERSION);
        localStorage.removeItem(CACHE_KEYS.CACHE_TIMESTAMP);
        console.log('Pokemon cache cleared');
    }
};

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

async function getMoveWithType(moveName) {
    try {
        const response = await fetch(`${API_URL}move/${moveName.toLowerCase()}`);
        const data = await response.json();
        return {
            name: moveName,
            type: data.type.name
        };
    } catch (error) {
        console.error(`Error fetching move ${moveName}:`, error);
        return { name: moveName, type: 'normal' }; // Default to normal type
    }
}

async function getPokemonDetailedData(pokemonName) {
    try {
        const pokemonResponse = await fetch(`${API_URL}pokemon/${pokemonName.toLowerCase()}`);
        const pokemonData = await pokemonResponse.json();
        
        // Try to get species data from the pokemon data's species URL
        let description = 'No description available.';
        try {
            const speciesResponse = await fetch(pokemonData.species.url);
            const speciesData = await speciesResponse.json();
            const englishEntry = speciesData.flavor_text_entries.find(entry => entry.language.name === 'en');
            description = englishEntry ? englishEntry.flavor_text.replace(/\f/g, ' ').replace(/\n/g, ' ') : 'No description available.';
        } catch (speciesError) {
            console.warn(`Could not fetch species data for ${pokemonName}:`, speciesError);
        }
        
        const moveNames = pokemonData.moves.map(move => move.move.name);
        const movesWithTypes = await Promise.all(
            moveNames.map(async (moveName) => {
                return await getMoveWithType(moveName);
            })
        );
        
        return {
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
    } catch (error) {
        console.error("Error fetching detailed Pokémon data:", error);
        return null;
    }
}

function formatMoveName(moveName) {
    return moveName
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

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
            const baseName = getBasePokemonName(pokemon.name);
            const detailedData = await getPokemonDetailedData(baseName);
            if (detailedData) {
                // Push current page to navigation stack
                NavigationSystem.push({ type: 'home' });
                displayPokemonDetail(detailedData);
            }
        } catch (error) {
            console.error('Error displaying Pokemon details:', error);
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

function displayPokemonDetail(pokemon) {
    const main = document.querySelector('main');
    const formattedName = pokemon.name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    
    main.innerHTML = `
        <div id="pokemon-detail">
            <button id="back-button">← Back to Pokemon Grid</button>
            
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
                        ${pokemon.abilities.map(ability => `<span class="ability-badge">${ability.charAt(0).toUpperCase() + ability.slice(1).replace('-', ' ')}</span>`).join('')}
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
                                                .map(move => `<span class="move-badge type-${move.type} clickable-move" data-move-name="${move.name}">${formatMoveName(move.name)}</span>`)
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
    
    document.getElementById('back-button').addEventListener('click', function() {
        NavigationSystem.goBack();
    });

    // Add click handlers for moves
    document.querySelectorAll('.clickable-move').forEach(moveElement => {
        moveElement.addEventListener('click', function() {
            const moveName = this.dataset.moveName;
            // Push current Pokemon page to navigation stack
            NavigationSystem.push({ type: 'pokemon', data: pokemon.name });
            displayMoveDetails(moveName);
        });
    });
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

async function displayMoveDetails(moveName) {
    const main = document.querySelector('main');
    
    try {
        const moveData = await fetchMoveData(moveName);
        if (!moveData) {
            main.innerHTML = `
                <div id="move-detail">
                    <button id="back-button">← Back</button>
                    <h1>Move not found</h1>
                    <p>Sorry, we couldn't load the details for "${moveName}".</p>
                </div>
            `;
            return;
        }

        const englishEffect = moveData.effect_entries.find(entry => entry.language.name === 'en');
        const description = englishEffect ? englishEffect.effect.replace(/\f/g, ' ').replace(/\n/g, ' ') : 'No effect description available.';
        
        const formattedName = formatMoveName(moveName);
        const damageClass = moveData.damage_class.name;
        const type = moveData.type.name;
        const accuracy = moveData.accuracy ? moveData.accuracy : 'N/A';
        const power = moveData.power ? moveData.power : 'N/A';
        
        main.innerHTML = `
            <div id="move-detail">
                <button id="back-button">← Back</button>
                
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
        
        // Add back button functionality
        document.getElementById('back-button').addEventListener('click', function() {
            NavigationSystem.goBack();
        });
        
        // Load Pokemon that can learn this move
        loadPokemonThatLearnMove(moveData.learned_by_pokemon, moveName);
        
    } catch (error) {
        console.error('Error displaying move details:', error);
        main.innerHTML = `
            <div id="move-detail">
                <button id="back-button">← Back</button>
                <h1>Error loading move</h1>
                <p>There was an error loading the move details.</p>
            </div>
        `;
    }
}

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
        const validPokemon = pokemonResults.filter(p => {
            if (!p) return false; // Remove null results
            // Remove Pokemon without sprites
            const hasSprite = p.sprite || (p.sprites && p.sprites.front_default);
            return hasSprite && hasSprite.trim() !== '';
        });
        
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
    const validFirstGeneration = firstGenerationResults.filter(pokemon => pokemon && pokemon.sprite);
    
    // Process remaining Pokemon
    const remainingPokemon = allPokemonNames.slice(POKEMON_LIMITS.FIRST_GENERATION);
    const remainingPromises = remainingPokemon.map(pokemon => 
        fetchPokemonData(pokemon.name, { spriteOnly: true })
    );
    
    console.log('Loading remaining Pokemon...');
    const remainingResults = await Promise.all(remainingPromises);
    const validRemaining = remainingResults.filter(pokemon => pokemon && pokemon.sprite);
    
    // Combine all valid Pokemon data
    const allPokemonData = [...validFirstGeneration, ...validRemaining];
    
    // Cache the complete dataset
    CACHE_UTILS.savePokemonList(allPokemonData);
    
    return allPokemonData;
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

document.addEventListener('DOMContentLoaded', function() {
    displayAllPokemon();
    
    // Set up search functionality
    setupSearchFunctionality();
});

function performSearch() {
    const searchTerm = document.getElementById('pokemon-input').value.trim().toLowerCase();
    
    if (searchTerm === '') {
        displayAllPokemon();
        return;
    }
    
    searchByPokemonName(searchTerm);
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
        displayAllPokemon();
    });
    
    pokemonList.forEach(pokemon => {
        pokemonGrid.appendChild(createPokemonCard(pokemon, true));
    });
}
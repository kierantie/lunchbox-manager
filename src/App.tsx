import React, { useState, useEffect } from 'react';
import { Plus, Trash2, RefreshCw, Calendar, Clock, CheckCircle, Archive, RotateCcw, Star, Edit, X, Shuffle, AlertTriangle, HelpCircle, Settings, Download, Upload } from 'lucide-react';

const LunchboxManager = () => {
  const [foods, setFoods] = useState([]);
  const [archivedFoods, setArchivedFoods] = useState([]);
  const [lunchHistory, setLunchHistory] = useState([]);
  const [todaysPlan, setTodaysPlan] = useState(null);
  const [planDate, setPlanDate] = useState('today');
  const [activeTab, setActiveTab] = useState('plan');
  const [editingFood, setEditingFood] = useState(null);
  const [availableTags, setAvailableTags] = useState(['🍓 fruity', '🧀 savoury', '🥨 crunchy', '🍬 chewy', '🍞 soft', '🍪 treat', '🍴 needs-cutlery']);
  const [newTag, setNewTag] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [confirmDeleteTag, setConfirmDeleteTag] = useState(null);
  const [showAllHistory, setShowAllHistory] = useState(false);
  const [showPackedConfirmation, setShowPackedConfirmation] = useState(false);
  const [motivationalMessage, setMotivationalMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    ameliaRating: 0,    // 0 = any rating, 1-5 = specific rating
    hazelRating: 0,     // 0 = any rating, 1-5 = specific rating  
    healthRating: 0,    // 0 = any rating, 1-5 = specific rating
    category: 'all'     // 'all' or specific category
  });
  const [smartPlanningWeights, setSmartPlanningWeights] = useState({
    preferenceWeight: 70,     // How much kid preference matters (0-100)
    varietyWeight: 20,        // How much variety/avoiding recent foods matters (0-100) 
    frequencyWeight: 10       // How much usage frequency matters (0-100)
  });
  const [appSettings, setAppSettings] = useState({
    maxHistoryDays: 90,       // Maximum days of lunch history to keep
    autoArchiveThreshold: 60, // Days without use before suggesting archive
    defaultServings: 1,       // Default servings when adding new food
    showUsageInPlanning: true,// Show usage frequency in planning view
    compactMode: false,       // Use compact display mode
    defaultSlots: {
      main: 1,                // Default main items per lunch
      recess: 2,              // Default recess items per lunch  
      extras: 2,              // Default extra items per lunch
      crunchSip: 1            // Default crunch & sip items per lunch
    }
  });
  const [newFood, setNewFood] = useState({
    name: '',
    category: 'snack', 
    prep: 'none',
    ameliaRating: 3,
    hazelRating: 3,
    healthRating: 3,
    tags: [],
    available: true,
    servings: null
  });

  // Motivational messages for immediate gratification
  const motivationalMessages = [
    { text: "🎉 Lunch planning pro!", emoji: "🌟" },
    { text: "✨ Another nutritious day ahead!", emoji: "🥗" }, 
    { text: "🚀 Lunchbox hero strikes again!", emoji: "💪" },
    { text: "🎯 Nailed that lunch plan!", emoji: "👏" },
    { text: "🏆 Master of meal prep!", emoji: "🏅" },
    { text: "⭐ Kids will love this!", emoji: "😋" },
    { text: "🌈 Variety is the spice of lunch!", emoji: "🎨" },
    { text: "🎪 Fun lunch adventure awaits!", emoji: "🎭" },
    { text: "🥇 Parent of the year!", emoji: "👑" },
    { text: "🎁 Lunchbox magic created!", emoji: "✨" }
  ];

  const showMotivationalMessage = (trigger = 'general') => {
    const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
    setMotivationalMessage(randomMessage);
    setTimeout(() => setMotivationalMessage(null), 3000); // Hide after 3 seconds
  };

  // Filter foods based on search query and rating filters
  const filterFoodsBySearch = (foodList) => {
    let filtered = foodList;
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(food => 
        food.name.toLowerCase().includes(query) ||
        food.category.toLowerCase().includes(query) ||
        food.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Apply rating filters
    if (filters.ameliaRating > 0) {
      filtered = filtered.filter(food => food.ameliaRating === filters.ameliaRating);
    }
    
    if (filters.hazelRating > 0) {
      filtered = filtered.filter(food => food.hazelRating === filters.hazelRating);
    }
    
    if (filters.healthRating > 0) {
      filtered = filtered.filter(food => food.healthRating === filters.healthRating);
    }
    
    return filtered;
  };

  // Calculate usage frequency for a food in the last 2 weeks
  const getFoodUsageFrequency = (foodId) => {
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    
    let count = 0;
    lunchHistory.forEach(entry => {
      const entryDate = new Date(entry.date);
      if (entryDate >= twoWeeksAgo) {
        // Check both kids' lunches
        [...(entry.amelia || []), ...(entry.hazel || [])].forEach(item => {
          if (item.id === foodId) {
            count++;
          }
        });
      }
    });
    
    return count;
  };

  // Export all app data as JSON
  const exportData = () => {
    const exportData = {
      foods,
      archivedFoods,
      lunchHistory,
      availableTags,
      smartPlanningWeights,
      appSettings,
      filters, // Include current filter settings
      exportDate: new Date().toISOString(),
      appVersion: "1.1.0", // From package.json
      dataFormatVersion: "1.1" // For backwards compatibility checking
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `lunchbox-manager-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    showMotivationalMessage('data_exported');
  };

  // Import data from JSON file
  const importData = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    // Check file type
    if (!file.name.toLowerCase().endsWith('.json')) {
      alert("❌ Error: Please select a valid JSON file");
      event.target.value = '';
      return;
    }
    
    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("❌ Error: File is too large (max 10MB)");
      event.target.value = '';
      return;
    }
    
    const confirmed = window.confirm(
      "⚠️ WARNING: This will replace ALL your current data!\n\n" +
      "Your foods, history, tags, and settings will be permanently overwritten.\n\n" +
      "Consider exporting a backup first.\n\n" +
      "Do you want to continue?"
    );
    
    if (!confirmed) {
      event.target.value = ''; // Reset file input
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        
        // Enhanced validation
        const validateFood = (food, index) => {
          if (!food || typeof food !== 'object') {
            throw new Error(`Food at index ${index} is not a valid object`);
          }
          if (!food.name || typeof food.name !== 'string') {
            throw new Error(`Food at index ${index} missing valid name`);
          }
          if (!food.category || typeof food.category !== 'string') {
            throw new Error(`Food at index ${index} missing valid category`);
          }
          if (typeof food.ameliaRating !== 'number' || food.ameliaRating < 1 || food.ameliaRating > 5) {
            throw new Error(`Food "${food.name}" has invalid Amelia rating (must be 1-5)`);
          }
          if (typeof food.hazelRating !== 'number' || food.hazelRating < 1 || food.hazelRating > 5) {
            throw new Error(`Food "${food.name}" has invalid Hazel rating (must be 1-5)`);
          }
          if (typeof food.healthRating !== 'number' || food.healthRating < 1 || food.healthRating > 5) {
            throw new Error(`Food "${food.name}" has invalid health rating (must be 1-5)`);
          }
          if (!Array.isArray(food.tags)) {
            throw new Error(`Food "${food.name}" has invalid tags (must be array)`);
          }
        };
        
        // Validate main data structure
        if (!importedData || typeof importedData !== 'object') {
          throw new Error("Invalid file format: not a valid JSON object");
        }
        
        if (!importedData.foods || !Array.isArray(importedData.foods)) {
          throw new Error("Invalid data format: foods array missing or invalid");
        }
        
        // Validate each food item
        importedData.foods.forEach((food, index) => {
          validateFood(food, index);
        });
        
        // Validate archived foods if present
        if (importedData.archivedFoods && !Array.isArray(importedData.archivedFoods)) {
          throw new Error("Invalid data format: archivedFoods must be an array");
        }
        
        if (importedData.archivedFoods) {
          importedData.archivedFoods.forEach((food, index) => {
            validateFood(food, index);
          });
        }
        
        // Validate lunch history if present
        if (importedData.lunchHistory && !Array.isArray(importedData.lunchHistory)) {
          throw new Error("Invalid data format: lunchHistory must be an array");
        }
        
        // Validate smart planning weights if present
        if (importedData.smartPlanningWeights) {
          const weights = importedData.smartPlanningWeights;
          if (typeof weights.preferenceWeight !== 'number' || weights.preferenceWeight < 0 || weights.preferenceWeight > 100) {
            throw new Error("Invalid smart planning weights: preferenceWeight must be 0-100");
          }
          if (typeof weights.varietyWeight !== 'number' || weights.varietyWeight < 0 || weights.varietyWeight > 100) {
            throw new Error("Invalid smart planning weights: varietyWeight must be 0-100");
          }
          if (typeof weights.frequencyWeight !== 'number' || weights.frequencyWeight < 0 || weights.frequencyWeight > 100) {
            throw new Error("Invalid smart planning weights: frequencyWeight must be 0-100");
          }
        }
        
        // Check data format version compatibility
        if (importedData.dataFormatVersion && importedData.dataFormatVersion !== "1.1") {
          const proceed = window.confirm(
            `⚠️ Version Warning:\n\n` +
            `This data file is from version ${importedData.dataFormatVersion || 'unknown'}.\n` +
            `Current app supports version 1.1.\n\n` +
            `The import might work but could cause issues.\n\n` +
            `Continue anyway?`
          );
          if (!proceed) {
            event.target.value = '';
            return;
          }
        }
        
        // Import all the data
        setFoods(importedData.foods || []);
        setArchivedFoods(importedData.archivedFoods || []);
        setLunchHistory(importedData.lunchHistory || []);
        setAvailableTags(importedData.availableTags || ['🍓 fruity', '🧀 savoury', '🥨 crunchy', '🍬 chewy', '🍞 soft', '🍪 treat', '🍴 needs-cutlery']);
        setSmartPlanningWeights(importedData.smartPlanningWeights || {
          preferenceWeight: 70,
          varietyWeight: 20,
          frequencyWeight: 10
        });
        setAppSettings(importedData.appSettings || {
          maxHistoryDays: 90,
          autoArchiveThreshold: 60,
          defaultServings: 1,
          showUsageInPlanning: true,
          compactMode: false,
          defaultSlots: {
            main: 1,
            recess: 2,
            extras: 2,
            crunchSip: 1
          }
        });
        
        // Import filters if present
        if (importedData.filters) {
          setFilters(importedData.filters);
        }
        
        showMotivationalMessage('data_imported');
        const importSummary = `✅ Data imported successfully!\n\n` +
          `• Foods: ${importedData.foods.length}\n` +
          `• Archived: ${(importedData.archivedFoods || []).length}\n` +
          `• History: ${(importedData.lunchHistory || []).length} days\n` +
          `• Tags: ${(importedData.availableTags || []).length}`;
        alert(importSummary);
        
      } catch (error) {
        console.error('Import error:', error);
        alert(`❌ Error importing data:\n\n${error.message}\n\nPlease check that your file is a valid lunchbox manager export.`);
      }
      
      event.target.value = ''; // Reset file input
    };
    
    reader.onerror = () => {
      alert("❌ Error reading file. Please try again.");
      event.target.value = '';
    };
    
    reader.readAsText(file);
  };

  // Initialize sample data
  useEffect(() => {
    if (foods.length === 0) {
      const sampleFoods = [
        // *** FRUITS ***
        { id: 1, name: "Bananas", category: "fruit", prep: "low", ameliaRating: 5, hazelRating: 5, healthRating: 5, tags: ["🍓 fruity", "🍞 soft"], available: true, servings: null },
        { id: 2, name: "Pink Lady Apples", category: "fruit", prep: "low", ameliaRating: 5, hazelRating: 5, healthRating: 5, tags: ["🍓 fruity", "🥨 crunchy"], available: true, servings: null },
        { id: 3, name: "Apple slices", category: "fruit", prep: "low", ameliaRating: 4, hazelRating: 5, healthRating: 5, tags: ["🍓 fruity", "🥨 crunchy"], available: true, servings: null },
        { id: 4, name: "Grapes", category: "fruit", prep: "none", ameliaRating: 5, hazelRating: 3, healthRating: 4, tags: ["🍓 fruity", "🍞 soft"], available: true, servings: null },
        { id: 5, name: "Orange segments", category: "fruit", prep: "low", ameliaRating: 3, hazelRating: 5, healthRating: 5, tags: ["🍓 fruity", "🍞 soft"], available: true, servings: null },
        { id: 6, name: "Dried Mango", category: "fruit", prep: "none", ameliaRating: 4, hazelRating: 5, healthRating: 4, tags: ["🍓 fruity", "🍬 chewy"], available: true, servings: 6 },
        { id: 7, name: "Fruit Strings", category: "fruit", prep: "low", ameliaRating: 4, hazelRating: 5, healthRating: 4, tags: ["🍓 fruity", "🍬 chewy"], available: true, servings: 8 },
        { id: 8, name: "Dried Blueberries", category: "fruit", prep: "none", ameliaRating: 4, hazelRating: 4, healthRating: 4, tags: ["🍓 fruity", "🍬 chewy"], available: true, servings: 6 },
        { id: 9, name: "Grape Roll Ups", category: "fruit", prep: "none", ameliaRating: 4, hazelRating: 4, healthRating: 4, tags: ["🍓 fruity", "🍬 chewy"], available: true, servings: 6 },
        { id: 10, name: "Mandarin Segments", category: "fruit", prep: "low", ameliaRating: 4, hazelRating: 4, healthRating: 4, tags: ["🍓 fruity", "🍞 soft", "🍴 needs-cutlery"], available: true, servings: 4 },
        
        // *** SNACKS (ADHD-friendly & sensory-focused) ***
        { id: 11, name: "Rice crackers", category: "snack", prep: "none", ameliaRating: 5, hazelRating: 5, healthRating: 3, tags: ["🥨 crunchy", "🧀 savoury"], available: true, servings: 10 },
        { id: 12, name: "Mamee noodles", category: "snack", prep: "none", ameliaRating: 4, hazelRating: 4, healthRating: 2, tags: ["🥨 crunchy", "🧀 savoury"], available: true, servings: 2 },
        { id: 13, name: "Soy crisps", category: "snack", prep: "none", ameliaRating: 4, hazelRating: 3, healthRating: 3, tags: ["🥨 crunchy", "🧀 savoury"], available: true, servings: 8 },
        { id: 14, name: "Fruit pouch", category: "snack", prep: "none", ameliaRating: 3, hazelRating: 4, healthRating: 4, tags: ["🍓 fruity", "🍞 soft"], available: true, servings: 6 },
        { id: 15, name: "Seaweed snacks", category: "snack", prep: "none", ameliaRating: 2, hazelRating: 4, healthRating: 4, tags: ["🧀 savoury", "🥨 crunchy"], available: true, servings: 15 },
        { id: 16, name: "Peanut Butter Pretzels", category: "snack", prep: "none", ameliaRating: 3, hazelRating: 4, healthRating: 3, tags: ["🧀 savoury", "🥨 crunchy"], available: true, servings: 8 },
        { id: 17, name: "Sweet & Salty Popcorn", category: "snack", prep: "low", ameliaRating: 3, hazelRating: 5, healthRating: 4, tags: ["🧀 savoury", "🥨 crunchy"], available: true, servings: 4 },
        { id: 18, name: "Apple Sauce", category: "snack", prep: "none", ameliaRating: 4, hazelRating: 4, healthRating: 3, tags: ["🍓 fruity", "🍞 soft"], available: true, servings: 4 },
        { id: 19, name: "Greek Yogurt Pouch Strawberry", category: "snack", prep: "none", ameliaRating: 4, hazelRating: 4, healthRating: 4, tags: ["🍓 fruity", "🍞 soft"], available: true, servings: 1 },
        { id: 20, name: "Vanilla Greek Yogurt", category: "snack", prep: "low", ameliaRating: 4, hazelRating: 4, healthRating: 4, tags: ["🧀 savoury", "🍞 soft", "🍴 needs-cutlery"], available: true, servings: 1 },
        { id: 21, name: "Peach Yogurt", category: "snack", prep: "low", ameliaRating: 4, hazelRating: 4, healthRating: 4, tags: ["🍓 fruity", "🍞 soft", "🍴 needs-cutlery"], available: true, servings: 1 },
        { id: 22, name: "Crackers", category: "snack", prep: "none", ameliaRating: 3, hazelRating: 3, healthRating: 3, tags: ["🧀 savoury", "🥨 crunchy"], available: true, servings: 10 },
        { id: 23, name: "Vegetable Chips", category: "snack", prep: "none", ameliaRating: 3, hazelRating: 3, healthRating: 3, tags: ["🧀 savoury", "🥨 crunchy"], available: true, servings: 6 },
        { id: 24, name: "Pretzel Twists", category: "snack", prep: "none", ameliaRating: 3, hazelRating: 3, healthRating: 3, tags: ["🧀 savoury", "🥨 crunchy"], available: true, servings: 8 },
        { id: 25, name: "Cheese sticks", category: "snack", prep: "none", ameliaRating: 4, hazelRating: 3, healthRating: 3, tags: ["🧀 savoury", "🍞 soft"], available: true, servings: 8 },
        { id: 26, name: "Shapes crackers", category: "snack", prep: "none", ameliaRating: 5, hazelRating: 4, healthRating: 2, tags: ["🧀 savoury", "🥨 crunchy"], available: true, servings: 12 },
        { id: 27, name: "Cheese cubes", category: "snack", prep: "low", ameliaRating: 3, hazelRating: 4, healthRating: 3, tags: ["🧀 savoury", "🍞 soft"], available: true, servings: 10 },
        { id: 28, name: "Tiny Teddies", category: "snack", prep: "none", ameliaRating: 5, hazelRating: 5, healthRating: 2, tags: ["🧀 savoury", "🥨 crunchy"], available: true, servings: 8 },
        { id: 29, name: "Vita-Weat crackers", category: "snack", prep: "none", ameliaRating: 4, hazelRating: 3, healthRating: 3, tags: ["🧀 savoury", "🥨 crunchy"], available: true, servings: 6 },
        { id: 30, name: "Mini muffins", category: "snack", prep: "none", ameliaRating: 5, hazelRating: 4, healthRating: 2, tags: ["🧀 savoury", "🍞 soft"], available: true, servings: 4 },
        { id: 51, name: "YoGo", category: "snack", prep: "none", ameliaRating: 4, hazelRating: 5, healthRating: 3, tags: ["🍓 fruity", "🍞 soft"], available: true, servings: 1 },
        { id: 52, name: "LCMs bars", category: "snack", prep: "none", ameliaRating: 4, hazelRating: 4, healthRating: 2, tags: ["🧀 savoury", "🍬 chewy"], available: true, servings: 6 },
        { id: 53, name: "Cheese & Bacon Balls", category: "snack", prep: "none", ameliaRating: 3, hazelRating: 4, healthRating: 2, tags: ["🧀 savoury", "🥨 crunchy"], available: true, servings: 8 },
        
        // *** VEGGIES (ADHD sensory-friendly) ***
        { id: 31, name: "Baby carrots", category: "veggie", prep: "low", ameliaRating: 3, hazelRating: 3, healthRating: 5, tags: ["🧀 savoury", "🥨 crunchy"], available: true, servings: null },
        { id: 32, name: "Cucumber slices", category: "veggie", prep: "low", ameliaRating: 4, hazelRating: 2, healthRating: 5, tags: ["🧀 savoury", "🥨 crunchy"], available: true, servings: null },
        { id: 33, name: "Cherry tomatoes", category: "veggie", prep: "none", ameliaRating: 2, hazelRating: 4, healthRating: 5, tags: ["🧀 savoury", "🍞 soft"], available: true, servings: null },
        { id: 34, name: "Red Capsicum strips", category: "veggie", prep: "low", ameliaRating: 3, hazelRating: 4, healthRating: 4, tags: ["🧀 savoury", "🥨 crunchy"], available: true, servings: null },
        { id: 35, name: "Sugar snap peas", category: "veggie", prep: "none", ameliaRating: 3, hazelRating: 4, healthRating: 5, tags: ["🧀 savoury", "🥨 crunchy"], available: true, servings: null },
        
        // *** MAIN ITEMS ***
        { id: 36, name: "Buttery spaghetti", category: "main", prep: "high", ameliaRating: 5, hazelRating: 4, healthRating: 3, tags: ["🧀 savoury", "🍞 soft", "🍴 needs-cutlery"], available: true, servings: null },
        { id: 37, name: "Rice with furikake", category: "main", prep: "medium", ameliaRating: 4, hazelRating: 5, healthRating: 4, tags: ["🧀 savoury", "🍞 soft", "🍴 needs-cutlery"], available: true, servings: null },
        { id: 38, name: "Chicken nuggets", category: "main", prep: "medium", ameliaRating: 5, hazelRating: 4, healthRating: 3, tags: ["🧀 savoury", "🥨 crunchy"], available: true, servings: null },
        { id: 39, name: "Sandwich rolls", category: "main", prep: "low", ameliaRating: 3, hazelRating: 3, healthRating: 4, tags: ["🧀 savoury", "🍞 soft"], available: true, servings: null },
        { id: 40, name: "Sourdough Bagels", category: "main", prep: "low", ameliaRating: 3, hazelRating: 3, healthRating: 3, tags: ["🧀 savoury", "🍞 soft"], available: true, servings: 6 },
        { id: 41, name: "Tortilla Wraps", category: "main", prep: "low", ameliaRating: 3, hazelRating: 3, healthRating: 3, tags: ["🧀 savoury", "🍞 soft"], available: true, servings: 8 },
        { id: 42, name: "Pasta salad", category: "main", prep: "medium", ameliaRating: 3, hazelRating: 4, healthRating: 3, tags: ["🧀 savoury", "🍞 soft", "🍴 needs-cutlery"], available: true, servings: null },
        { id: 43, name: "Mini pizzas", category: "main", prep: "medium", ameliaRating: 5, hazelRating: 5, healthRating: 2, tags: ["🧀 savoury", "🍞 soft"], available: true, servings: 4 },
        
        // *** TREATS (Australian favourites) ***
        { id: 44, name: "Mini cookies", category: "treat", prep: "none", ameliaRating: 5, hazelRating: 5, healthRating: 1, tags: ["🍪 treat", "🍞 soft"], available: true, servings: 20 },
        { id: 45, name: "Chocolate Fruit Treats", category: "treat", prep: "low", ameliaRating: 4, hazelRating: 4, healthRating: 4, tags: ["🍪 treat", "🍓 fruity", "🍬 chewy"], available: true, servings: 8 },
        { id: 46, name: "Arnotts Biscuits", category: "treat", prep: "none", ameliaRating: 4, hazelRating: 5, healthRating: 2, tags: ["🍪 treat", "🥨 crunchy"], available: true, servings: 10 },
        { id: 47, name: "Tim Tams (mini)", category: "treat", prep: "none", ameliaRating: 5, hazelRating: 4, healthRating: 1, tags: ["🍪 treat", "🥨 crunchy"], available: true, servings: 6 },
        { id: 48, name: "Allen's Lollies", category: "treat", prep: "none", ameliaRating: 5, hazelRating: 4, healthRating: 2, tags: ["🍪 treat", "🍬 chewy"], available: true, servings: 8 },
        { id: 49, name: "Freddo Frogs", category: "treat", prep: "none", ameliaRating: 5, hazelRating: 5, healthRating: 1, tags: ["🍪 treat", "🍞 soft"], available: true, servings: 4 },
        { id: 50, name: "Roll-Ups", category: "treat", prep: "none", ameliaRating: 4, hazelRating: 4, healthRating: 2, tags: ["🍪 treat", "🍬 chewy"], available: true, servings: 6 }
      ];
      setFoods(sampleFoods);
    }
  }, [foods.length]);

  const isRunningLow = (food) => {
    if (!food.servings) return false;
    return food.servings <= 3 && food.servings > 0;
  };

  const getPlanDate = () => {
    const today = new Date();
    if (planDate === 'tomorrow') {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow.toLocaleDateString();
    }
    return today.toLocaleDateString();
  };

  const formatDateWithDay = (dateString) => {
    // Handle different date formats that might come from toLocaleDateString()
    let date;
    if (dateString.includes('/')) {
      // Handle MM/DD/YYYY format
      date = new Date(dateString);
    } else {
      // Handle other formats or fallback
      date = new Date(dateString);
    }
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return dateString; // Return original string if invalid
    }
    
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    if (date.toDateString() === today.toDateString()) {
      return `Today, ${dayName} ${dateStr}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${dayName} ${dateStr}`;
    } else {
      return `${dayName}, ${dateStr}`;
    }
  };

  const getSlotColor = (slot) => {
    const colors = {
      recess: 'bg-blue-50 border-l-blue-400 text-blue-900',
      crunchAndSip: 'bg-yellow-50 border-l-yellow-400 text-yellow-900',
      main: 'bg-green-50 border-l-green-500 text-green-900',
      veggie: 'bg-green-50 border-l-green-400 text-green-900',
      extra: 'bg-green-50 border-l-green-300 text-green-900'
    };
    return colors[slot] || 'bg-gray-50 border-l-gray-400 text-gray-900';
  };

  // Helper function to filter foods by child's preferences
  const getFilteredFoods = (foods, child) => {
    return foods.filter(f => {
      if (f.available === false) return false;
      const rating = child === 'amelia' ? f.ameliaRating : f.hazelRating;
      return rating > 0; // Never include 0-star foods
    });
  };

  // Helper function to sort foods by preference rating (highest first)
  const sortByPreference = (foods, child) => {
    return [...foods].sort((a, b) => {
      const ratingA = child === 'amelia' ? a.ameliaRating : a.hazelRating;
      const ratingB = child === 'amelia' ? b.ameliaRating : b.hazelRating;
      return ratingB - ratingA;
    });
  };

  // Helper function to select items with preference weighting and variety
  const selectPreferredItems = (foods, count, child, usedTags = []) => {
    if (foods.length === 0) return [];
    
    const sorted = sortByPreference(foods, child);
    const selected = [];
    const childRating = child === 'amelia' ? 'ameliaRating' : 'hazelRating';
    
    // Group foods by rating
    const highRated = sorted.filter(f => f[childRating] >= 4);
    const mediumRated = sorted.filter(f => f[childRating] === 3);
    const lowRated = sorted.filter(f => f[childRating] <= 2 && f[childRating] > 0);
    
    // Try to fill with high-rated items first, then medium, then low as fallback
    const pools = [highRated, mediumRated, lowRated];
    
    for (let i = 0; i < count && selected.length < count; i++) {
      let selectedItem = null;
      
      // Try each rating pool
      for (const pool of pools) {
        if (pool.length === 0) continue;
        
        // Filter out already selected items and promote variety
        const availableItems = pool.filter(item => 
          !selected.some(s => s.id === item.id) &&
          (!usedTags.length || !item.tags.some(tag => usedTags.includes(tag)))
        );
        
        if (availableItems.length > 0) {
          // Select randomly from top items in this rating pool
          const topItems = availableItems.slice(0, Math.min(3, availableItems.length));
          selectedItem = topItems[Math.floor(Math.random() * topItems.length)];
          break;
        }
      }
      
      // If no item found with variety, just pick from any available
      if (!selectedItem) {
        const remainingItems = sorted.filter(item => 
          !selected.some(s => s.id === item.id)
        );
        if (remainingItems.length > 0) {
          selectedItem = remainingItems[0];
        }
      }
      
      if (selectedItem) {
        selected.push(selectedItem);
        // Track tags for variety
        usedTags.push(...selectedItem.tags);
      }
    }
    
    return selected;
  };

  // Helper function to calculate dynamic quantities based on main dish rating and settings
  const getDynamicQuantities = (mainRating) => {
    // Use default slot counts from settings, but adjust based on main rating
    const baseRecess = appSettings.defaultSlots.recess;
    const baseExtras = appSettings.defaultSlots.extras;
    
    return {
      mainCount: appSettings.defaultSlots.main,
      recessCount: mainRating >= 4 ? Math.max(1, baseRecess - 1) : baseRecess,
      extrasCount: mainRating >= 4 ? Math.max(1, baseExtras - 1) : baseExtras,
      crunchSipCount: appSettings.defaultSlots.crunchSip
    };
  };

  // Helper function to get foods used in last N days for a specific child
  const getRecentlyUsedFoods = (child, days = 2) => {
    const recentHistory = lunchHistory.slice(-days);
    const usedFoodIds = new Set();
    
    recentHistory.forEach(day => {
      if (day[child]) {
        day[child].forEach(item => {
          usedFoodIds.add(item.id);
        });
      }
    });
    
    return usedFoodIds;
  };

  // History-aware version of selectPreferredItems that deprioritizes recently used foods
  const selectPreferredItemsWithHistory = (foods, count, child, usedTags = [], includeRecentHistory = true) => {
    if (foods.length === 0) return [];
    
    const recentlyUsedIds = includeRecentHistory ? getRecentlyUsedFoods(child) : new Set();
    const sorted = sortByPreference(foods, child);
    const selected = [];
    const childRating = child === 'amelia' ? 'ameliaRating' : 'hazelRating';
    
    // Apply history penalty: reduce effective rating for recently used foods
    const adjustedFoods = sorted.map(food => ({
      ...food,
      effectiveRating: recentlyUsedIds.has(food.id) ? Math.max(1, food[childRating] - 1.5) : food[childRating]
    }));
    
    // Re-sort by effective rating
    const reSorted = adjustedFoods.sort((a, b) => b.effectiveRating - a.effectiveRating);
    
    // Group by effective rating
    const highRated = reSorted.filter(f => f.effectiveRating >= 4);
    const mediumRated = reSorted.filter(f => f.effectiveRating >= 2.5 && f.effectiveRating < 4);
    const lowRated = reSorted.filter(f => f.effectiveRating < 2.5 && f.effectiveRating > 0);
    
    const pools = [highRated, mediumRated, lowRated];
    
    for (let i = 0; i < count && selected.length < count; i++) {
      let selectedItem = null;
      
      // Try each rating pool
      for (const pool of pools) {
        if (pool.length === 0) continue;
        
        // Filter out already selected items and promote variety
        const availableItems = pool.filter(item => 
          !selected.some(s => s.id === item.id) &&
          (!usedTags.length || !item.tags.some(tag => usedTags.includes(tag)))
        );
        
        if (availableItems.length > 0) {
          // Select randomly from top items in this rating pool, but prefer non-recent items
          const nonRecentItems = availableItems.filter(item => !recentlyUsedIds.has(item.id));
          const itemsToChooseFrom = nonRecentItems.length > 0 ? nonRecentItems : availableItems;
          
          const topItems = itemsToChooseFrom.slice(0, Math.min(3, itemsToChooseFrom.length));
          selectedItem = topItems[Math.floor(Math.random() * topItems.length)];
          break;
        }
      }
      
      // If no item found with variety, just pick from any available
      if (!selectedItem) {
        const remainingItems = reSorted.filter(item => 
          !selected.some(s => s.id === item.id)
        );
        if (remainingItems.length > 0) {
          const nonRecentItems = remainingItems.filter(item => !recentlyUsedIds.has(item.id));
          const itemsToChooseFrom = nonRecentItems.length > 0 ? nonRecentItems : remainingItems;
          selectedItem = itemsToChooseFrom[0];
        }
      }
      
      if (selectedItem) {
        selected.push(selectedItem);
        // Track tags for variety
        usedTags.push(...selectedItem.tags);
      }
    }
    
    return selected;
  };

  const shuffleEntireLunchbox = (child) => {
    if (!todaysPlan) return;

    const planDate = todaysPlan.date;
    const dateObj = new Date(planDate);
    const dayOfWeek = dateObj.getDay();
    
    // Helper function to add randomness to selection
    const selectRandomPreferredItems = (foods, count, child, usedTags = []) => {
      if (foods.length === 0) return [];
      
      const sorted = sortByPreference(foods, child);
      const selected = [];
      const childRating = child === 'amelia' ? 'ameliaRating' : 'hazelRating';
      
      // Group foods by rating with some randomness
      const highRated = sorted.filter(f => f[childRating] >= 4);
      const mediumRated = sorted.filter(f => f[childRating] === 3);
      const lowRated = sorted.filter(f => f[childRating] <= 2 && f[childRating] > 0);
      
      // Add more randomness by shuffling within each rating group
      const shuffleArray = (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
      };
      
      const pools = [shuffleArray(highRated), shuffleArray(mediumRated), shuffleArray(lowRated)];
      
      for (let i = 0; i < count && selected.length < count; i++) {
        let selectedItem = null;
        
        // Try each rating pool with some randomness
        for (const pool of pools) {
          if (pool.length === 0) continue;
          
          const availableItems = pool.filter(item => 
            !selected.some(s => s.id === item.id) &&
            (!usedTags.length || !item.tags.some(tag => usedTags.includes(tag)))
          );
          
          if (availableItems.length > 0) {
            // Pick randomly from available items instead of always taking the first
            selectedItem = availableItems[Math.floor(Math.random() * availableItems.length)];
            break;
          }
        }
        
        // Fallback: pick any remaining item randomly
        if (!selectedItem) {
          const remainingItems = sorted.filter(item => 
            !selected.some(s => s.id === item.id)
          );
          if (remainingItems.length > 0) {
            selectedItem = remainingItems[Math.floor(Math.random() * remainingItems.length)];
          }
        }
        
        if (selectedItem) {
          selected.push(selectedItem);
          usedTags.push(...selectedItem.tags);
        }
      }
      
      return selected;
    };

    const shouldIncludeTreat = (child) => {
      const dayName = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][dayOfWeek];
      
      if (child === 'hazel' && dayName === 'monday') return true;
      if (child === 'amelia' && dayName === 'thursday') return true;
      if (dayName === 'friday') return true;
      
      return false;
    };

    const getChildFoods = (category, child) => {
      const categoryFoods = foods.filter(f => f.category === category);
      return getFilteredFoods(categoryFoods, child);
    };

    const generateChildPlan = (child) => {
      const snacks = getChildFoods('snack', child);
      const fruits = getChildFoods('fruit', child);
      const mains = getChildFoods('main', child);
      const veggies = getChildFoods('veggie', child);
      
      // Use random selection for shuffle (ignores history for true randomness)
      const selectedMain = selectRandomPreferredItems(mains, 1, child)[0];
      const mainRating = selectedMain ? (child === 'amelia' ? selectedMain.ameliaRating : selectedMain.hazelRating) : 3;
      
      const { mainCount, recessCount, extrasCount, crunchSipCount } = getDynamicQuantities(mainRating);
      
      const recessFoods = [...snacks, ...fruits]; // Recess can have snacks and fruits
      const lunchExtrasFoods = [...snacks, ...fruits]; // Lunch extras can include fruits for variety
      const crunchSipFoods = [...fruits, ...veggies]; // Crunch & Sip can be fruits or veggies
      const usedTags = selectedMain ? [...selectedMain.tags] : [];
      
      const recessItems = selectRandomPreferredItems(recessFoods, recessCount, child, [...usedTags]);
      recessItems.forEach(item => usedTags.push(...item.tags));
      
      const crunchSipItems = selectRandomPreferredItems(crunchSipFoods, crunchSipCount, child, [...usedTags]);
      crunchSipItems.forEach(item => usedTags.push(...item.tags));
      
      const veggieItem = selectRandomPreferredItems(veggies, 1, child, [...usedTags])[0];
      if (veggieItem) usedTags.push(...veggieItem.tags);
      
      let extrasItems = selectRandomPreferredItems(lunchExtrasFoods, extrasCount, child, [...usedTags]);
      
      if (shouldIncludeTreat(child) && extrasItems.length < extrasCount) {
        const treats = getChildFoods('snack', child).filter(f => f.tags.some(tag => tag.includes('treat')));
        const treatItem = selectRandomPreferredItems(treats, 1, child, [...usedTags])[0];
        if (treatItem) {
          extrasItems = [treatItem, ...extrasItems.slice(0, extrasCount - 1)];
        }
      }
      
      return {
        recess: recessItems,
        crunchSip: crunchSipItems,
        main: selectedMain ? [selectedMain] : [],
        veggie: veggieItem ? [veggieItem] : [],
        extras: extrasItems
      };
    };

    // Generate new plan for this child only
    const newChildPlan = generateChildPlan(child);
    
    // Update just this child's plan
    const updatedPlan = {
      ...todaysPlan,
      [child]: newChildPlan
    };

    setTodaysPlan(updatedPlan);
    showMotivationalMessage('shuffle_complete');
  };


  const generateRecommendations = () => {
    const planDate = getPlanDate();
    const dateObj = new Date(planDate);
    const dayOfWeek = dateObj.getDay(); // 0=Sunday, 1=Monday, etc.

    // Determine if treats should be included based on day
    const shouldIncludeTreat = (child) => {
      const dayName = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][dayOfWeek];
      
      if (child === 'hazel' && dayName === 'monday') return true;
      if (child === 'amelia' && dayName === 'thursday') return true;
      if (dayName === 'friday') return true; // Both kids
      
      return false;
    };

    // Get foods by category with child preferences
    const getChildFoods = (category, child) => {
      const categoryFoods = foods.filter(f => f.category === category);
      return getFilteredFoods(categoryFoods, child);
    };

    // Generate plan for each child
    const generateChildPlan = (child) => {
      const snacks = getChildFoods('snack', child);
      const fruits = getChildFoods('fruit', child);
      const mains = getChildFoods('main', child);
      const veggies = getChildFoods('veggie', child);
      
      // Select main dish first using history-aware selection
      const selectedMain = selectPreferredItemsWithHistory(mains, 1, child)[0];
      const mainRating = selectedMain ? (child === 'amelia' ? selectedMain.ameliaRating : selectedMain.hazelRating) : 3;
      
      // Determine quantities based on main rating
      const { mainCount, recessCount, extrasCount, crunchSipCount } = getDynamicQuantities(mainRating);
      
      const recessFoods = [...snacks, ...fruits]; // Recess can have snacks and fruits
      const lunchExtrasFoods = [...snacks, ...fruits]; // Lunch extras can include fruits for variety
      const crunchSipFoods = [...fruits, ...veggies]; // Crunch & Sip can be fruits or veggies
      const usedTags = selectedMain ? [...selectedMain.tags] : [];
      
      // Select items using history-aware selection
      const recessItems = selectPreferredItemsWithHistory(recessFoods, recessCount, child, [...usedTags]);
      recessItems.forEach(item => usedTags.push(...item.tags));
      
      const crunchSipItems = selectPreferredItemsWithHistory(crunchSipFoods, crunchSipCount, child, [...usedTags]);
      crunchSipItems.forEach(item => usedTags.push(...item.tags));
      
      const veggieItem = selectPreferredItemsWithHistory(veggies, 1, child, [...usedTags])[0];
      if (veggieItem) usedTags.push(...veggieItem.tags);
      
      let extrasItems = selectPreferredItemsWithHistory(lunchExtrasFoods, extrasCount, child, [...usedTags]);
      
      // Add treat if it's a treat day and we have room
      if (shouldIncludeTreat(child) && extrasItems.length < extrasCount) {
        const treats = getChildFoods('snack', child).filter(f => f.tags.some(tag => tag.includes('treat')));
        const treatItem = selectPreferredItemsWithHistory(treats, 1, child, [...usedTags])[0];
        if (treatItem) {
          extrasItems = [treatItem, ...extrasItems.slice(0, extrasCount - 1)];
        }
      }
      
      return {
        recess: recessItems,
        crunchSip: crunchSipItems,
        main: selectedMain ? [selectedMain] : [],
        veggie: veggieItem ? [veggieItem] : [],
        extras: extrasItems
      };
    };

    const plan = {
      date: planDate,
      amelia: generateChildPlan('amelia'),
      hazel: generateChildPlan('hazel')
    };

    setTodaysPlan(plan);
    showMotivationalMessage('plan_generated');
  };

  // Add a new slot to a specific section of a child's plan
  const addSlot = (child, section) => {
    if (!todaysPlan) return;
    
    const childPlan = todaysPlan[child];
    const snacks = getChildFoods('snack', child);
    const fruits = getChildFoods('fruit', child);
    const mains = getChildFoods('main', child);
    const veggies = getChildFoods('veggie', child);
    
    // Get foods already used in this child's plan to avoid duplicates
    const usedFoodIds = new Set();
    ['main', 'recess', 'extras', 'crunchSip', 'veggie'].forEach(sec => {
      if (childPlan[sec]) {
        childPlan[sec].forEach(item => usedFoodIds.add(item.id));
      }
    });
    
    let newItem = null;
    let availableFoods = [];
    
    // Determine what type of food to add based on section
    switch (section) {
      case 'main':
        availableFoods = mains.filter(f => !usedFoodIds.has(f.id));
        break;
      case 'recess':
        availableFoods = [...snacks, ...fruits].filter(f => !usedFoodIds.has(f.id));
        break;
      case 'extras':
        availableFoods = [...snacks, ...fruits].filter(f => !usedFoodIds.has(f.id));
        break;
      case 'crunchSip':
        availableFoods = [...fruits, ...veggies].filter(f => !usedFoodIds.has(f.id));
        break;
      case 'veggie':
        availableFoods = veggies.filter(f => !usedFoodIds.has(f.id));
        break;
    }
    
    // Select a new item using the same logic as plan generation
    if (availableFoods.length > 0) {
      const recentlyUsedFoods = getRecentlyUsedFoods(child, 2);
      const availableNonRecent = availableFoods.filter(f => !recentlyUsedFoods.has(f.id));
      const foodsToChooseFrom = availableNonRecent.length > 0 ? availableNonRecent : availableFoods;
      
      newItem = selectPreferredItemsWithHistory(foodsToChooseFrom, 1, child)[0];
    }
    
    if (newItem) {
      const updatedPlan = {
        ...todaysPlan,
        [child]: {
          ...childPlan,
          [section]: [...(childPlan[section] || []), newItem]
        }
      };
      setTodaysPlan(updatedPlan);
      showMotivationalMessage('slot_added');
    }
  };

  // Remove a slot from a specific section of a child's plan
  const removeSlot = (child, section, index) => {
    if (!todaysPlan) return;
    
    const childPlan = todaysPlan[child];
    const sectionItems = [...(childPlan[section] || [])];
    
    // Remove the item at the specified index
    sectionItems.splice(index, 1);
    
    const updatedPlan = {
      ...todaysPlan,
      [child]: {
        ...childPlan,
        [section]: sectionItems
      }
    };
    
    setTodaysPlan(updatedPlan);
  };

  const addFood = () => {
    if (newFood.name.trim()) {
      const food = {
        ...newFood,
        id: Date.now(),
        tags: newFood.tags.filter(tag => tag.trim() !== ''),
        servings: newFood.servings
      };
      setFoods([...foods, food]);
      showMotivationalMessage('food_added');
      setNewFood({
        name: '',
        category: 'snack',
        prep: 'none',
        ameliaRating: 3,
        hazelRating: 3,
        healthRating: 3,
        tags: [],
        available: true,
        servings: null
      });
    }
  };

  const updateFood = (updatedFood) => {
    // If servings is set to 0, automatically archive the food
    if (updatedFood.servings === 0) {
      setFoods(foods.filter(f => f.id !== updatedFood.id));
      setArchivedFoods([...archivedFoods, { ...updatedFood, available: false }]);
    } else {
      setFoods(foods.map(f => f.id === updatedFood.id ? updatedFood : f));
    }
    setEditingFood(null);
  };

  const archiveFood = (id) => {
    const food = foods.find(f => f.id === id);
    if (food) {
      setFoods(foods.filter(f => f.id !== id));
      setArchivedFoods([...archivedFoods, { ...food, available: false }]);
    }
  };

  const restoreFood = (id) => {
    const food = archivedFoods.find(f => f.id === id);
    if (food) {
      setArchivedFoods(archivedFoods.filter(f => f.id !== id));
      setFoods([...foods, { ...food, available: true }]);
    }
  };

  const deleteFood = (id, isArchived = false) => {
    setConfirmDelete({ id, isArchived, type: 'food' });
  };

  const confirmDeleteAction = () => {
    if (confirmDelete) {
      if (confirmDelete.isArchived) {
        setArchivedFoods(archivedFoods.filter(f => f.id !== confirmDelete.id));
      } else {
        setFoods(foods.filter(f => f.id !== confirmDelete.id));
      }
      setConfirmDelete(null);
    }
  };

  const confirmDeleteTagAction = () => {
    if (confirmDeleteTag) {
      setAvailableTags(availableTags.filter(t => t !== confirmDeleteTag));
      // Remove tag from all foods
      setFoods(foods.map(f => ({...f, tags: f.tags.filter(t => t !== confirmDeleteTag)})));
      setConfirmDeleteTag(null);
    }
  };

  const TagBadges = ({ tags = [] }) => {
    const tagColors = {
      'fruity': 'bg-pink-100 text-pink-800',
      'savoury': 'bg-blue-100 text-blue-800', 
      'crunchy': 'bg-orange-100 text-orange-800',
      'chewy': 'bg-purple-100 text-purple-800',
      'soft': 'bg-gray-100 text-gray-800',
      'treat': 'bg-red-100 text-red-800'
    };

    return (
      <div className="flex flex-wrap gap-1">
        {tags.map((tag, idx) => (
          <span key={idx} className={`px-2 py-1 rounded-full text-xs ${tagColors[tag] || 'bg-gray-100 text-gray-800'}`}>
            {tag}
          </span>
        ))}
      </div>
    );
  };

  const swapSingleItem = (child, slot, itemIndex = null) => {
    if (!todaysPlan) return;

    const updatedPlan = { ...todaysPlan };
    
    // Get all currently used items to avoid duplicates
    const allCurrentItems = [
      ...(Array.isArray(updatedPlan[child].recess) ? updatedPlan[child].recess : []),
      ...(Array.isArray(updatedPlan[child].crunchSip) ? updatedPlan[child].crunchSip : []),
      ...(Array.isArray(updatedPlan[child].main) ? updatedPlan[child].main : []),
      ...(Array.isArray(updatedPlan[child].veggie) ? updatedPlan[child].veggie : []),
      ...(Array.isArray(updatedPlan[child].extras) ? updatedPlan[child].extras : [])
    ].filter(Boolean);
    
    const usedIds = allCurrentItems.map(item => item.id);
    
    let availableItems = [];
    let currentItem = null;
    
    // Determine what we're swapping and get available alternatives
    if (slot === 'main' && itemIndex !== null) {
      availableItems = getFilteredFoods(foods.filter(f => f.category === 'main'), child);
      currentItem = updatedPlan[child].main[itemIndex];
    } else if (slot === 'veggie' && itemIndex !== null) {
      availableItems = getFilteredFoods(foods.filter(f => f.category === 'veggie'), child);
      currentItem = updatedPlan[child].veggie[itemIndex];
    } else if (slot === 'crunchSip' && itemIndex !== null) {
      const fruits = foods.filter(f => f.category === 'fruit');
      const veggies = foods.filter(f => f.category === 'veggie');
      availableItems = getFilteredFoods([...fruits, ...veggies], child);
      currentItem = updatedPlan[child].crunchSip[itemIndex];
    } else if (slot === 'recess' && itemIndex !== null) {
      const snacks = foods.filter(f => f.category === 'snack');
      const fruits = foods.filter(f => f.category === 'fruit');
      availableItems = getFilteredFoods([...snacks, ...fruits], child);
      currentItem = updatedPlan[child].recess[itemIndex];
    } else if (slot === 'extras' && itemIndex !== null) {
      const snacks = foods.filter(f => f.category === 'snack');
      const fruits = foods.filter(f => f.category === 'fruit');
      availableItems = getFilteredFoods([...snacks, ...fruits], child);
      currentItem = updatedPlan[child].extras[itemIndex];
    }
    
    if (!currentItem || availableItems.length === 0) return;
    
    // Find alternatives excluding current item and other used items
    const alternatives = availableItems.filter(food => 
      food.id !== currentItem.id && !usedIds.includes(food.id)
    );
    
    if (alternatives.length === 0) return;
    
    // Select new item with preference weighting
    const newItem = selectPreferredItems(alternatives, 1, child, [])[0];
    if (!newItem) return;
    
    // Update the specific item
    if (slot === 'main' || slot === 'veggie' || slot === 'crunchSip') {
      updatedPlan[child][slot][itemIndex] = newItem;
      
      // If main changed, recalculate dynamic quantities
      if (slot === 'main') {
        const newMainRating = child === 'amelia' ? newItem.ameliaRating : newItem.hazelRating;
        const { recessCount, extrasCount } = getDynamicQuantities(newMainRating);
        
        // Adjust arrays if needed
        if (updatedPlan[child].recess.length !== recessCount) {
          if (recessCount > updatedPlan[child].recess.length) {
            // Add more items
            const snacks = foods.filter(f => f.category === 'snack');
            const fruits = foods.filter(f => f.category === 'fruit');
            const mixedFoods = getFilteredFoods([...snacks, ...fruits], child);
            const moreItems = selectPreferredItems(mixedFoods, recessCount - updatedPlan[child].recess.length, child, []);
            updatedPlan[child].recess = [...updatedPlan[child].recess, ...moreItems];
          } else {
            // Remove items
            updatedPlan[child].recess = updatedPlan[child].recess.slice(0, recessCount);
          }
        }
        
        if (updatedPlan[child].extras.length !== extrasCount) {
          if (extrasCount > updatedPlan[child].extras.length) {
            // Add more items
            const snacks = foods.filter(f => f.category === 'snack');
            const fruits = foods.filter(f => f.category === 'fruit');
            const mixedFoods = getFilteredFoods([...snacks, ...fruits], child);
            const moreItems = selectPreferredItems(mixedFoods, extrasCount - updatedPlan[child].extras.length, child, []);
            updatedPlan[child].extras = [...updatedPlan[child].extras, ...moreItems];
          } else {
            // Remove items
            updatedPlan[child].extras = updatedPlan[child].extras.slice(0, extrasCount);
          }
        }
      }
    } else if (slot === 'recess' && itemIndex !== null) {
      const newRecess = [...updatedPlan[child].recess];
      newRecess[itemIndex] = newItem;
      updatedPlan[child].recess = newRecess;
    } else if (slot === 'extras' && itemIndex !== null) {
      const newExtras = [...updatedPlan[child].extras];
      newExtras[itemIndex] = newItem;
      updatedPlan[child].extras = newExtras;
    }
    
    setTodaysPlan(updatedPlan);
  };



  const confirmPlan = () => {
    if (todaysPlan) {
      // Check for duplicate date in history
      const existingEntry = lunchHistory.find(entry => entry.date === todaysPlan.date);
      if (existingEntry) {
        const shouldReplace = window.confirm(
          `You already packed lunches for ${todaysPlan.date}!\n\nDo you want to replace the existing plan with this new one?`
        );
        if (!shouldReplace) {
          return; // User cancelled, don't pack
        }
      }

      const historyEntry = {
        date: todaysPlan.date,
        amelia: [
          ...todaysPlan.amelia.recess.map(item => ({...item, slot: 'recess'})),
          ...todaysPlan.amelia.crunchSip.map(item => ({...item, slot: 'crunchSip'})),
          ...todaysPlan.amelia.main.map(item => ({...item, slot: 'main'})),
          ...todaysPlan.amelia.veggie.map(item => ({...item, slot: 'veggie'})),
          ...todaysPlan.amelia.extras.map(item => ({...item, slot: 'extra'}))
        ],
        hazel: [
          ...todaysPlan.hazel.recess.map(item => ({...item, slot: 'recess'})),
          ...todaysPlan.hazel.crunchSip.map(item => ({...item, slot: 'crunchSip'})),
          ...todaysPlan.hazel.main.map(item => ({...item, slot: 'main'})),
          ...todaysPlan.hazel.veggie.map(item => ({...item, slot: 'veggie'})),
          ...todaysPlan.hazel.extras.map(item => ({...item, slot: 'extra'}))
        ]
      };
      
      // TODO: Here we would deduct from stock levels for items that have servings
      // For now we just save to history
      
      // Replace existing entry if duplicate, otherwise add new
      const updatedHistory = existingEntry 
        ? lunchHistory.map(entry => entry.date === todaysPlan.date ? historyEntry : entry)
        : [...lunchHistory, historyEntry];
      
      setLunchHistory(updatedHistory);
      setTodaysPlan(null);
      setShowPackedConfirmation(true);
      showMotivationalMessage('lunches_packed');
      
      // Auto-hide confirmation after 3 seconds
      setTimeout(() => {
        setShowPackedConfirmation(false);
      }, 3000);
    }
  };

  const StarRating = ({ rating, onChange, label, readOnly = false }) => {
    return (
      <div className="flex items-center gap-1">
        <span className="text-sm text-gray-600 w-16">{label}:</span>
        {/* Zero star option */}
        {!readOnly && onChange && (
          <button
            type="button"
            onClick={() => onChange(0)}
            className={`${rating === 0 ? 'text-red-500 bg-red-50' : 'text-gray-400'} hover:text-red-400 hover:bg-red-50 px-1 py-0.5 rounded text-xs font-bold border`}
            title="Never include (0 stars)"
          >
            ✗
          </button>
        )}
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type="button"
            onClick={() => !readOnly && onChange && onChange(star)}
            className={`${star <= rating ? 'text-yellow-400' : 'text-gray-300'} ${!readOnly && onChange ? 'hover:text-yellow-300' : ''}`}
            disabled={readOnly}
          >
            <Star className="w-4 h-4 fill-current" />
          </button>
        ))}
      </div>
    );
  };

  const PrepBadge = ({ prep }) => {
    const colors = {
      none: 'bg-green-100 text-green-800',
      low: 'bg-yellow-100 text-yellow-800',
      medium: 'bg-orange-100 text-orange-800',
      high: 'bg-red-100 text-red-800'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[prep]}`}>
        {prep} prep
      </span>
    );
  };

  const HealthBadge = ({ rating }) => {
    const colors = {
      1: 'bg-red-100 text-red-800',
      2: 'bg-orange-100 text-orange-800',
      3: 'bg-yellow-100 text-yellow-800',
      4: 'bg-green-100 text-green-800',
      5: 'bg-emerald-100 text-emerald-800'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[rating]}`}>
        Health: {rating}/5
      </span>
    );
  };

  const updateNewFoodTag = (index, value) => {
    const newTags = [...newFood.tags];
    newTags[index] = value;
    setNewFood({...newFood, tags: newTags});
  };

  const addNewFoodTag = () => {
    setNewFood({...newFood, tags: [...newFood.tags, '']});
  };

  const removeNewFoodTag = (index) => {
    const newTags = newFood.tags.filter((_, i) => i !== index);
    setNewFood({...newFood, tags: newTags});
  };

  const FoodEditor = ({ food, onSave, onCancel }) => {
    const [editedFood, setEditedFood] = useState(food);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Edit Food</h3>
            <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              value={editedFood.name}
              onChange={(e) => setEditedFood({...editedFood, name: e.target.value})}
              className="w-full p-2 border rounded-lg"
              placeholder="Food name"
            />

            <div className="grid grid-cols-2 gap-4">
              <select
                value={editedFood.category}
                onChange={(e) => setEditedFood({...editedFood, category: e.target.value})}
                className="p-2 border rounded-lg"
              >
                <option value="snack">Snack/Side</option>
                <option value="fruit">Fruit</option>
                <option value="main">Main</option>
                <option value="veggie">Veggie</option>
              </select>

              <select
                value={editedFood.prep}
                onChange={(e) => setEditedFood({...editedFood, prep: e.target.value})}
                className="p-2 border rounded-lg"
              >
                <option value="none">No prep</option>
                <option value="low">Low prep</option>
                <option value="medium">Medium prep</option>
                <option value="high">High prep</option>
              </select>
            </div>

            <div className="space-y-2">
              <StarRating 
                rating={editedFood.ameliaRating} 
                onChange={(rating) => setEditedFood({...editedFood, ameliaRating: rating})}
                label="Amelia"
              />
              <StarRating 
                rating={editedFood.hazelRating} 
                onChange={(rating) => setEditedFood({...editedFood, hazelRating: rating})}
                label="Hazel"
              />
              <StarRating 
                rating={editedFood.healthRating} 
                onChange={(rating) => setEditedFood({...editedFood, healthRating: rating})}
                label="Health"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Stock/Servings</label>
              <input
                type="number"
                placeholder="Servings available (leave empty for unlimited)"
                value={editedFood.servings || ''}
                onChange={(e) => setEditedFood({...editedFood, servings: e.target.value ? parseInt(e.target.value) : null})}
                className="w-full p-2 border rounded-lg text-sm"
                min="0"
              />
              <p className="text-xs text-gray-500 mt-1">Leave empty for unlimited stock (like fresh fruits). Set to 0 to mark as out of stock.</p>
            </div>

            <div className="flex gap-2 pt-4">
              <button
                onClick={() => onSave(editedFood)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Save Changes
              </button>
              <button
                onClick={onCancel}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      {/* Confirmation Dialog */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to permanently delete this food? This cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={confirmDeleteAction}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
              <button
                onClick={() => setConfirmDelete(null)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tag Delete Confirmation Dialog */}
      {confirmDeleteTag && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete Tag</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the tag "<span className="font-medium text-gray-900">{confirmDeleteTag}</span>"? 
              This will remove it from all foods and cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={confirmDeleteTagAction}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Delete Tag
              </button>
              <button
                onClick={() => setConfirmDeleteTag(null)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Food Editor */}
      {editingFood && (
        <FoodEditor 
          food={editingFood} 
          onSave={updateFood} 
          onCancel={() => setEditingFood(null)} 
        />
      )}
        {/* Packed Confirmation Banner */}
        {showPackedConfirmation && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Lunches packed successfully! 🎉</span>
          </div>
        )}

        {/* Main App Container */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 sm:px-6 py-4 sm:py-8 text-white">
            <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">🍱 Lunchbox Manager</h1>
            <p className="text-indigo-100 text-sm sm:text-lg">ADHD-friendly lunch planning for Amelia & Hazel</p>
          </div>

          {/* Motivational Message */}
          {motivationalMessage && (
            <div className="bg-gradient-to-r from-green-400 to-blue-500 px-4 py-3 text-center text-white animate-pulse">
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl">{motivationalMessage.emoji}</span>
                <span className="font-semibold text-lg">{motivationalMessage.text}</span>
                <span className="text-2xl">{motivationalMessage.emoji}</span>
              </div>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200 bg-gray-50">
            <nav className="flex space-x-1 p-2 overflow-x-auto scrollbar-hide" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('plan')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 whitespace-nowrap ${
                  activeTab === 'plan' 
                    ? 'bg-blue-100 text-blue-700 shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                }`}
              >
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline">Today's Plan</span>
                <span className="sm:hidden">Plan</span>
              </button>
              
              <button
                onClick={() => setActiveTab('history')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 whitespace-nowrap ${
                  activeTab === 'history' 
                    ? 'bg-purple-100 text-purple-700 shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                }`}
              >
                <Clock className="w-4 h-4 flex-shrink-0" />
                <span>History</span>
              </button>
              
              <button
                onClick={() => setActiveTab('foods')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 whitespace-nowrap ${
                  activeTab === 'foods' 
                    ? 'bg-green-100 text-green-700 shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                }`}
              >
                <Plus className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline">Manage Foods</span>
                <span className="sm:hidden">Foods</span>
              </button>
              
              <button
                onClick={() => setActiveTab('tags')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 whitespace-nowrap ${
                  activeTab === 'tags' 
                    ? 'bg-orange-100 text-orange-700 shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                }`}
              >
                <span>Tags</span>
              </button>
              
              <button
                onClick={() => setActiveTab('help')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 whitespace-nowrap ${
                  activeTab === 'help' 
                    ? 'bg-cyan-100 text-cyan-700 shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                }`}
              >
                <HelpCircle className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline">How to Use</span>
                <span className="sm:hidden">Help</span>
              </button>
              
              <button
                onClick={() => setActiveTab('settings')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 whitespace-nowrap ${
                  activeTab === 'settings' 
                    ? 'bg-gray-100 text-gray-700 shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                }`}
              >
                <Settings className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline">Settings</span>
                <span className="sm:hidden">Settings</span>
              </button>
            </nav>
          </div>

          {/* Content Area */}
          <div className="p-4 sm:p-6 lg:p-8">
          {activeTab === 'plan' && (
            <div>
              {/* Plan Header */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 border border-blue-200">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">📅 Today's Lunch Plan</h2>
                    <p className="text-gray-600">Generate personalized lunch recommendations for both kids</p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-semibold text-gray-700">Plan for:</label>
                      <select
                        value={planDate}
                        onChange={(e) => setPlanDate(e.target.value)}
                        className="border-2 border-gray-300 rounded-lg px-3 py-2 text-sm font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                      >
                        <option value="today">Today</option>
                        <option value="tomorrow">Tomorrow</option>
                      </select>
                    </div>
                    
                    <button
                      onClick={generateRecommendations}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 flex items-center gap-2 font-medium shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>Generate Plan</span>
                    </button>
                  </div>
                </div>
              </div>

              {todaysPlan ? (
                <div className="space-y-6">
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-medium text-gray-700">Plan for {todaysPlan.date}</h3>
                  </div>
                  
                  {/* Treat Day Banner */}
                  {(() => {
                    const planDate = getPlanDate();
                    const dateObj = new Date(planDate);
                    const dayOfWeek = dateObj.getDay();
                    const dayName = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][dayOfWeek];
                    
                    if (dayName === 'monday') {
                      return (
                        <div className="bg-gradient-to-r from-pink-100 to-purple-100 border-2 border-pink-200 rounded-xl p-4 text-center">
                          <div className="text-2xl mb-2">🍪</div>
                          <div className="font-semibold text-pink-800">Monday Treat Day for Hazel!</div>
                          <div className="text-sm text-pink-600">A special treat has been added to Hazel's lunch</div>
                        </div>
                      );
                    } else if (dayName === 'thursday') {
                      return (
                        <div className="bg-gradient-to-r from-purple-100 to-blue-100 border-2 border-purple-200 rounded-xl p-4 text-center">
                          <div className="text-2xl mb-2">🍪</div>
                          <div className="font-semibold text-purple-800">Thursday Treat Day for Amelia!</div>
                          <div className="text-sm text-purple-600">A special treat has been added to Amelia's lunch</div>
                        </div>
                      );
                    } else if (dayName === 'friday') {
                      return (
                        <div className="bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-200 rounded-xl p-4 text-center">
                          <div className="text-2xl mb-2">🎉🍪</div>
                          <div className="font-semibold text-orange-800">Friday Treat Day for Everyone!</div>
                          <div className="text-sm text-orange-600">Special treats have been added to both lunchboxes</div>
                        </div>
                      );
                    }
                    return null;
                  })()}
                  
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center border-b-2 border-purple-200 pb-2">
                        <h3 className="text-lg font-semibold text-purple-600">
                          Amelia's Lunchbox
                        </h3>
                        <button
                          onClick={() => shuffleEntireLunchbox('amelia')}
                          className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-200 flex items-center gap-2 font-medium border-2 border-purple-200 transition-all duration-200"
                        >
                          <Shuffle className="w-4 h-4" />
                          Shuffle Everything
                        </button>
                      </div>
                      
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Recess (10 min) 
                          <span className="text-xs bg-blue-100 px-2 py-1 rounded-full">
                            {todaysPlan.amelia.recess.length} items
                          </span>
                          <div className="flex items-center gap-1 ml-auto">
                            <button
                              onClick={() => addSlot('amelia', 'recess')}
                              className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 flex items-center justify-center text-xs font-bold"
                              title="Add recess item"
                            >
                              +
                            </button>
                            {todaysPlan.amelia.recess.length > 1 && (
                              <button
                                onClick={() => removeSlot('amelia', 'recess', todaysPlan.amelia.recess.length - 1)}
                                className="w-6 h-6 rounded-full bg-red-100 text-red-600 hover:bg-red-200 flex items-center justify-center text-xs font-bold"
                                title="Remove last recess item"
                              >
                                −
                              </button>
                            )}
                          </div>
                        </h4>
                        <div className="space-y-2">
                          {todaysPlan.amelia.recess.map((item, idx) => (
                            <div key={idx} className="bg-white p-3 rounded border-l-2 border-blue-400">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <div className="font-medium">{item.name}</div>
                                    {(() => {
                                      const usageCount = getFoodUsageFrequency(item.id);
                                      if (usageCount > 0) {
                                        return (
                                          <span className="px-1.5 py-0.5 rounded text-xs bg-gray-100 text-gray-600">
                                            {usageCount}x
                                          </span>
                                        );
                                      }
                                      return null;
                                    })()}
                                  </div>
                                  <div className="flex items-center gap-2 mt-1">
                                    <StarRating rating={item.ameliaRating} label="Rating" readOnly />
                                  </div>
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    <PrepBadge prep={item.prep} />
                                    <HealthBadge rating={item.healthRating} />
                                    {isRunningLow(item) && (
                                      <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800 flex items-center gap-1">
                                        <AlertTriangle className="w-3 h-3" />
                                        Low stock
                                      </span>
                                    )}
                                  </div>
                                  <TagBadges tags={item.tags} />
                                </div>
                                <div className="flex items-center gap-1 ml-2">
                                  <button
                                    onClick={() => swapSingleItem('amelia', 'recess', idx)}
                                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                                    title="Shuffle this item"
                                  >
                                    <Shuffle className="w-3 h-3" />
                                  </button>
                                  {todaysPlan.amelia.recess.length > 1 && (
                                    <button
                                      onClick={() => removeSlot('amelia', 'recess', idx)}
                                      className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
                                      title="Remove this item"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-yellow-900 mb-3 flex items-center gap-2">
                          Crunch & Sip
                          <span className="text-xs bg-yellow-100 px-2 py-1 rounded-full">
                            {todaysPlan.amelia.crunchSip.length} items
                          </span>
                          <div className="flex items-center gap-1 ml-auto">
                            <button
                              onClick={() => addSlot('amelia', 'crunchSip')}
                              className="w-6 h-6 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 flex items-center justify-center text-xs font-bold"
                              title="Add crunch & sip item"
                            >
                              +
                            </button>
                            {todaysPlan.amelia.crunchSip.length > 1 && (
                              <button
                                onClick={() => removeSlot('amelia', 'crunchSip', todaysPlan.amelia.crunchSip.length - 1)}
                                className="w-6 h-6 rounded-full bg-red-100 text-red-600 hover:bg-red-200 flex items-center justify-center text-xs font-bold"
                                title="Remove last crunch & sip item"
                              >
                                −
                              </button>
                            )}
                          </div>
                        </h4>
                        <div className="space-y-2">
                          {todaysPlan.amelia.crunchSip.map((item, idx) => (
                            <div key={idx} className="bg-white p-3 rounded border-l-2 border-yellow-400">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <div className="font-medium">{item.name}</div>
                                    {(() => {
                                      const usageCount = getFoodUsageFrequency(item.id);
                                      if (usageCount > 0) {
                                        return (
                                          <span className="px-1.5 py-0.5 rounded text-xs bg-gray-100 text-gray-600">
                                            {usageCount}x
                                          </span>
                                        );
                                      }
                                      return null;
                                    })()}
                                  </div>
                                  <div className="flex items-center gap-2 mt-1">
                                    <StarRating rating={item.ameliaRating} label="Rating" readOnly />
                                  </div>
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    <PrepBadge prep={item.prep} />
                                    <HealthBadge rating={item.healthRating} />
                                    {isRunningLow(item) && (
                                      <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800 flex items-center gap-1">
                                        <AlertTriangle className="w-3 h-3" />
                                        Low stock
                                      </span>
                                    )}
                                  </div>
                                  <TagBadges tags={item.tags} />
                                </div>
                                <div className="flex items-center gap-1 ml-2">
                                  <button
                                    onClick={() => swapSingleItem('amelia', 'crunchSip', idx)}
                                    className="text-yellow-600 hover:text-yellow-800 text-sm flex items-center gap-1"
                                    title="Shuffle this item"
                                  >
                                    <Shuffle className="w-3 h-3" />
                                  </button>
                                  {todaysPlan.amelia.crunchSip.length > 1 && (
                                    <button
                                      onClick={() => removeSlot('amelia', 'crunchSip', idx)}
                                      className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
                                      title="Remove this item"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Lunch (10 min eating)
                          <span className="text-xs bg-green-100 px-2 py-1 rounded-full">
                            {todaysPlan.amelia.extras.length} extras
                          </span>
                          <div className="flex items-center gap-1 ml-auto">
                            <button
                              onClick={() => addSlot('amelia', 'extras')}
                              className="w-6 h-6 rounded-full bg-green-100 text-green-600 hover:bg-green-200 flex items-center justify-center text-xs font-bold"
                              title="Add extra item"
                            >
                              +
                            </button>
                            {todaysPlan.amelia.extras.length > 1 && (
                              <button
                                onClick={() => removeSlot('amelia', 'extras', todaysPlan.amelia.extras.length - 1)}
                                className="w-6 h-6 rounded-full bg-red-100 text-red-600 hover:bg-red-200 flex items-center justify-center text-xs font-bold"
                                title="Remove last extra item"
                              >
                                −
                              </button>
                            )}
                          </div>
                        </h4>
                        <div className="space-y-2">
                          {todaysPlan.amelia.main.map((item, idx) => (
                            <div key={idx} className="bg-white p-3 rounded border-l-4 border-green-500">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <div className="text-xs font-medium text-green-700 uppercase">Main</div>
                                    <div className="flex items-center gap-1">
                                      <button
                                        onClick={() => addSlot('amelia', 'main')}
                                        className="w-4 h-4 rounded-full bg-green-100 text-green-600 hover:bg-green-200 flex items-center justify-center text-xs font-bold"
                                        title="Add main item"
                                      >
                                        +
                                      </button>
                                      {todaysPlan.amelia.main.length > 1 && (
                                        <button
                                          onClick={() => removeSlot('amelia', 'main', idx)}
                                          className="w-4 h-4 rounded-full bg-red-100 text-red-600 hover:bg-red-200 flex items-center justify-center text-xs font-bold"
                                          title="Remove this main item"
                                        >
                                          −
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="font-medium">{item.name}</div>
                                    {(() => {
                                      const usageCount = getFoodUsageFrequency(item.id);
                                      if (usageCount > 0) {
                                        return (
                                          <span className="px-1.5 py-0.5 rounded text-xs bg-gray-100 text-gray-600">
                                            {usageCount}x
                                          </span>
                                        );
                                      }
                                      return null;
                                    })()}
                                  </div>
                                  <div className="flex items-center gap-2 mt-1">
                                    <StarRating rating={item.ameliaRating} label="Rating" readOnly />
                                  </div>
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    <PrepBadge prep={item.prep} />
                                    <HealthBadge rating={item.healthRating} />
                                    {isRunningLow(item) && (
                                      <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800 flex items-center gap-1">
                                        <AlertTriangle className="w-3 h-3" />
                                        Low stock
                                      </span>
                                    )}
                                  </div>
                                  <TagBadges tags={item.tags} />
                                </div>
                                <button
                                  onClick={() => swapSingleItem('amelia', 'main', idx)}
                                  className="text-green-600 hover:text-green-800 text-sm flex items-center gap-1 ml-2"
                                  title="Shuffle this item"
                                >
                                  <Shuffle className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          ))}
                          
                          {todaysPlan.amelia.veggie.map((item, idx) => (
                            <div key={idx} className="bg-white p-3 rounded border-l-2 border-green-300">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <div className="text-xs font-medium text-green-700 uppercase">Veggie</div>
                                    <div className="flex items-center gap-1">
                                      <button
                                        onClick={() => addSlot('amelia', 'veggie')}
                                        className="w-4 h-4 rounded-full bg-green-100 text-green-600 hover:bg-green-200 flex items-center justify-center text-xs font-bold"
                                        title="Add veggie item"
                                      >
                                        +
                                      </button>
                                      {todaysPlan.amelia.veggie.length > 1 && (
                                        <button
                                          onClick={() => removeSlot('amelia', 'veggie', idx)}
                                          className="w-4 h-4 rounded-full bg-red-100 text-red-600 hover:bg-red-200 flex items-center justify-center text-xs font-bold"
                                          title="Remove this veggie item"
                                        >
                                          −
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="font-medium">{item.name}</div>
                                    {(() => {
                                      const usageCount = getFoodUsageFrequency(item.id);
                                      if (usageCount > 0) {
                                        return (
                                          <span className="px-1.5 py-0.5 rounded text-xs bg-gray-100 text-gray-600">
                                            {usageCount}x
                                          </span>
                                        );
                                      }
                                      return null;
                                    })()}
                                  </div>
                                  <div className="flex items-center gap-2 mt-1">
                                    <StarRating rating={item.ameliaRating} label="Rating" readOnly />
                                  </div>
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    <PrepBadge prep={item.prep} />
                                    <HealthBadge rating={item.healthRating} />
                                    {isRunningLow(item) && (
                                      <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800 flex items-center gap-1">
                                        <AlertTriangle className="w-3 h-3" />
                                        Low stock
                                      </span>
                                    )}
                                  </div>
                                  <TagBadges tags={item.tags} />
                                </div>
                                <button
                                  onClick={() => swapSingleItem('amelia', 'veggie', idx)}
                                  className="text-green-600 hover:text-green-800 text-sm flex items-center gap-1 ml-2"
                                  title="Shuffle this item"
                                >
                                  <Shuffle className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          ))}

                          {todaysPlan.amelia.extras.map((item, idx) => (
                            <div key={idx} className="bg-white p-3 rounded border-l-2 border-green-300">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <div className="text-xs font-medium text-green-700 uppercase">Extra</div>
                                  <div className="flex items-center gap-2">
                                    <div className="font-medium">{item.name}</div>
                                    {(() => {
                                      const usageCount = getFoodUsageFrequency(item.id);
                                      if (usageCount > 0) {
                                        return (
                                          <span className="px-1.5 py-0.5 rounded text-xs bg-gray-100 text-gray-600">
                                            {usageCount}x
                                          </span>
                                        );
                                      }
                                      return null;
                                    })()}
                                  </div>
                                  <div className="flex items-center gap-2 mt-1">
                                    <StarRating rating={item.ameliaRating} label="Rating" readOnly />
                                  </div>
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    <PrepBadge prep={item.prep} />
                                    <HealthBadge rating={item.healthRating} />
                                    {isRunningLow(item) && (
                                      <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800 flex items-center gap-1">
                                        <AlertTriangle className="w-3 h-3" />
                                        Low stock
                                      </span>
                                    )}
                                  </div>
                                  <TagBadges tags={item.tags} />
                                </div>
                                <div className="flex items-center gap-1 ml-2">
                                  <button
                                    onClick={() => swapSingleItem('amelia', 'extras', idx)}
                                    className="text-green-600 hover:text-green-800 text-sm flex items-center gap-1"
                                    title="Shuffle this item"
                                  >
                                    <Shuffle className="w-3 h-3" />
                                  </button>
                                  {todaysPlan.amelia.extras.length > 1 && (
                                    <button
                                      onClick={() => removeSlot('amelia', 'extras', idx)}
                                      className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
                                      title="Remove this item"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center border-b-2 border-pink-200 pb-2">
                        <h3 className="text-lg font-semibold text-pink-600">
                          Hazel's Lunchbox
                        </h3>
                        <button
                          onClick={() => shuffleEntireLunchbox('hazel')}
                          className="bg-pink-100 text-pink-700 px-4 py-2 rounded-lg hover:bg-pink-200 flex items-center gap-2 font-medium border-2 border-pink-200 transition-all duration-200"
                        >
                          <Shuffle className="w-4 h-4" />
                          Shuffle Everything
                        </button>
                      </div>
                      
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Recess (10 min)
                          <span className="text-xs bg-blue-100 px-2 py-1 rounded-full">
                            {todaysPlan.hazel.recess.length} items
                          </span>
                          <div className="flex items-center gap-1 ml-auto">
                            <button
                              onClick={() => addSlot('hazel', 'recess')}
                              className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 flex items-center justify-center text-xs font-bold"
                              title="Add recess item"
                            >
                              +
                            </button>
                            {todaysPlan.hazel.recess.length > 1 && (
                              <button
                                onClick={() => removeSlot('hazel', 'recess', todaysPlan.hazel.recess.length - 1)}
                                className="w-6 h-6 rounded-full bg-red-100 text-red-600 hover:bg-red-200 flex items-center justify-center text-xs font-bold"
                                title="Remove last recess item"
                              >
                                −
                              </button>
                            )}
                          </div>
                        </h4>
                        <div className="space-y-2">
                          {todaysPlan.hazel.recess.map((item, idx) => (
                            <div key={idx} className="bg-white p-3 rounded border-l-2 border-blue-400">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <div className="font-medium">{item.name}</div>
                                    {(() => {
                                      const usageCount = getFoodUsageFrequency(item.id);
                                      if (usageCount > 0) {
                                        return (
                                          <span className="px-1.5 py-0.5 rounded text-xs bg-gray-100 text-gray-600">
                                            {usageCount}x
                                          </span>
                                        );
                                      }
                                      return null;
                                    })()}
                                  </div>
                                  <div className="flex items-center gap-2 mt-1">
                                    <StarRating rating={item.hazelRating} label="Rating" readOnly />
                                  </div>
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    <PrepBadge prep={item.prep} />
                                    <HealthBadge rating={item.healthRating} />
                                    {isRunningLow(item) && (
                                      <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800 flex items-center gap-1">
                                        <AlertTriangle className="w-3 h-3" />
                                        Low stock
                                      </span>
                                    )}
                                  </div>
                                  <TagBadges tags={item.tags} />
                                </div>
                                <div className="flex items-center gap-1 ml-2">
                                  <button
                                    onClick={() => swapSingleItem('hazel', 'recess', idx)}
                                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                                    title="Shuffle this item"
                                  >
                                    <Shuffle className="w-3 h-3" />
                                  </button>
                                  {todaysPlan.hazel.recess.length > 1 && (
                                    <button
                                      onClick={() => removeSlot('hazel', 'recess', idx)}
                                      className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
                                      title="Remove this item"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-yellow-900 mb-3 flex items-center gap-2">
                          Crunch & Sip
                          <span className="text-xs bg-yellow-100 px-2 py-1 rounded-full">
                            {todaysPlan.hazel.crunchSip.length} items
                          </span>
                          <div className="flex items-center gap-1 ml-auto">
                            <button
                              onClick={() => addSlot('hazel', 'crunchSip')}
                              className="w-6 h-6 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 flex items-center justify-center text-xs font-bold"
                              title="Add crunch & sip item"
                            >
                              +
                            </button>
                            {todaysPlan.hazel.crunchSip.length > 1 && (
                              <button
                                onClick={() => removeSlot('hazel', 'crunchSip', todaysPlan.hazel.crunchSip.length - 1)}
                                className="w-6 h-6 rounded-full bg-red-100 text-red-600 hover:bg-red-200 flex items-center justify-center text-xs font-bold"
                                title="Remove last crunch & sip item"
                              >
                                −
                              </button>
                            )}
                          </div>
                        </h4>
                        <div className="space-y-2">
                          {todaysPlan.hazel.crunchSip.map((item, idx) => (
                            <div key={idx} className="bg-white p-3 rounded border-l-2 border-yellow-400">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <div className="font-medium">{item.name}</div>
                                    {(() => {
                                      const usageCount = getFoodUsageFrequency(item.id);
                                      if (usageCount > 0) {
                                        return (
                                          <span className="px-1.5 py-0.5 rounded text-xs bg-gray-100 text-gray-600">
                                            {usageCount}x
                                          </span>
                                        );
                                      }
                                      return null;
                                    })()}
                                  </div>
                                  <div className="flex items-center gap-2 mt-1">
                                    <StarRating rating={item.hazelRating} label="Rating" readOnly />
                                  </div>
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    <PrepBadge prep={item.prep} />
                                    <HealthBadge rating={item.healthRating} />
                                    {isRunningLow(item) && (
                                      <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800 flex items-center gap-1">
                                        <AlertTriangle className="w-3 h-3" />
                                        Low stock
                                      </span>
                                    )}
                                  </div>
                                  <TagBadges tags={item.tags} />
                                </div>
                                <div className="flex items-center gap-1 ml-2">
                                  <button
                                    onClick={() => swapSingleItem('hazel', 'crunchSip', idx)}
                                    className="text-yellow-600 hover:text-yellow-800 text-sm flex items-center gap-1"
                                    title="Shuffle this item"
                                  >
                                    <Shuffle className="w-3 h-3" />
                                  </button>
                                  {todaysPlan.hazel.crunchSip.length > 1 && (
                                    <button
                                      onClick={() => removeSlot('hazel', 'crunchSip', idx)}
                                      className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
                                      title="Remove this item"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Lunch (10 min eating)
                          <span className="text-xs bg-green-100 px-2 py-1 rounded-full">
                            {todaysPlan.hazel.extras.length} extras
                          </span>
                          <div className="flex items-center gap-1 ml-auto">
                            <button
                              onClick={() => addSlot('hazel', 'extras')}
                              className="w-6 h-6 rounded-full bg-green-100 text-green-600 hover:bg-green-200 flex items-center justify-center text-xs font-bold"
                              title="Add extra item"
                            >
                              +
                            </button>
                            {todaysPlan.hazel.extras.length > 1 && (
                              <button
                                onClick={() => removeSlot('hazel', 'extras', todaysPlan.hazel.extras.length - 1)}
                                className="w-6 h-6 rounded-full bg-red-100 text-red-600 hover:bg-red-200 flex items-center justify-center text-xs font-bold"
                                title="Remove last extra item"
                              >
                                −
                              </button>
                            )}
                          </div>
                        </h4>
                        <div className="space-y-2">
                          {todaysPlan.hazel.main.map((item, idx) => (
                            <div key={idx} className="bg-white p-3 rounded border-l-4 border-green-500">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <div className="text-xs font-medium text-green-700 uppercase">Main</div>
                                    <div className="flex items-center gap-1">
                                      <button
                                        onClick={() => addSlot('hazel', 'main')}
                                        className="w-4 h-4 rounded-full bg-green-100 text-green-600 hover:bg-green-200 flex items-center justify-center text-xs font-bold"
                                        title="Add main item"
                                      >
                                        +
                                      </button>
                                      {todaysPlan.hazel.main.length > 1 && (
                                        <button
                                          onClick={() => removeSlot('hazel', 'main', idx)}
                                          className="w-4 h-4 rounded-full bg-red-100 text-red-600 hover:bg-red-200 flex items-center justify-center text-xs font-bold"
                                          title="Remove this main item"
                                        >
                                          −
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="font-medium">{item.name}</div>
                                    {(() => {
                                      const usageCount = getFoodUsageFrequency(item.id);
                                      if (usageCount > 0) {
                                        return (
                                          <span className="px-1.5 py-0.5 rounded text-xs bg-gray-100 text-gray-600">
                                            {usageCount}x
                                          </span>
                                        );
                                      }
                                      return null;
                                    })()}
                                  </div>
                                  <div className="flex items-center gap-2 mt-1">
                                    <StarRating rating={item.hazelRating} label="Rating" readOnly />
                                  </div>
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    <PrepBadge prep={item.prep} />
                                    <HealthBadge rating={item.healthRating} />
                                    {isRunningLow(item) && (
                                      <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800 flex items-center gap-1">
                                        <AlertTriangle className="w-3 h-3" />
                                        Low stock
                                      </span>
                                    )}
                                  </div>
                                  <TagBadges tags={item.tags} />
                                </div>
                                <button
                                  onClick={() => swapSingleItem('hazel', 'main', idx)}
                                  className="text-green-600 hover:text-green-800 text-sm flex items-center gap-1 ml-2"
                                  title="Shuffle this item"
                                >
                                  <Shuffle className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          ))}
                          
                          {todaysPlan.hazel.veggie.map((item, idx) => (
                            <div key={idx} className="bg-white p-3 rounded border-l-2 border-green-300">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <div className="text-xs font-medium text-green-700 uppercase">Veggie</div>
                                    <div className="flex items-center gap-1">
                                      <button
                                        onClick={() => addSlot('hazel', 'veggie')}
                                        className="w-4 h-4 rounded-full bg-green-100 text-green-600 hover:bg-green-200 flex items-center justify-center text-xs font-bold"
                                        title="Add veggie item"
                                      >
                                        +
                                      </button>
                                      {todaysPlan.hazel.veggie.length > 1 && (
                                        <button
                                          onClick={() => removeSlot('hazel', 'veggie', idx)}
                                          className="w-4 h-4 rounded-full bg-red-100 text-red-600 hover:bg-red-200 flex items-center justify-center text-xs font-bold"
                                          title="Remove this veggie item"
                                        >
                                          −
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="font-medium">{item.name}</div>
                                    {(() => {
                                      const usageCount = getFoodUsageFrequency(item.id);
                                      if (usageCount > 0) {
                                        return (
                                          <span className="px-1.5 py-0.5 rounded text-xs bg-gray-100 text-gray-600">
                                            {usageCount}x
                                          </span>
                                        );
                                      }
                                      return null;
                                    })()}
                                  </div>
                                  <div className="flex items-center gap-2 mt-1">
                                    <StarRating rating={item.hazelRating} label="Rating" readOnly />
                                  </div>
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    <PrepBadge prep={item.prep} />
                                    <HealthBadge rating={item.healthRating} />
                                    {isRunningLow(item) && (
                                      <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800 flex items-center gap-1">
                                        <AlertTriangle className="w-3 h-3" />
                                        Low stock
                                      </span>
                                    )}
                                  </div>
                                  <TagBadges tags={item.tags} />
                                </div>
                                <button
                                  onClick={() => swapSingleItem('hazel', 'veggie', idx)}
                                  className="text-green-600 hover:text-green-800 text-sm flex items-center gap-1 ml-2"
                                  title="Shuffle this item"
                                >
                                  <Shuffle className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          ))}

                          {todaysPlan.hazel.extras.map((item, idx) => (
                            <div key={idx} className="bg-white p-3 rounded border-l-2 border-green-300">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <div className="text-xs font-medium text-green-700 uppercase">Extra</div>
                                  <div className="flex items-center gap-2">
                                    <div className="font-medium">{item.name}</div>
                                    {(() => {
                                      const usageCount = getFoodUsageFrequency(item.id);
                                      if (usageCount > 0) {
                                        return (
                                          <span className="px-1.5 py-0.5 rounded text-xs bg-gray-100 text-gray-600">
                                            {usageCount}x
                                          </span>
                                        );
                                      }
                                      return null;
                                    })()}
                                  </div>
                                  <div className="flex items-center gap-2 mt-1">
                                    <StarRating rating={item.hazelRating} label="Rating" readOnly />
                                  </div>
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    <PrepBadge prep={item.prep} />
                                    <HealthBadge rating={item.healthRating} />
                                    {isRunningLow(item) && (
                                      <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800 flex items-center gap-1">
                                        <AlertTriangle className="w-3 h-3" />
                                        Low stock
                                      </span>
                                    )}
                                  </div>
                                  <TagBadges tags={item.tags} />
                                </div>
                                <div className="flex items-center gap-1 ml-2">
                                  <button
                                    onClick={() => swapSingleItem('hazel', 'extras', idx)}
                                    className="text-green-600 hover:text-green-800 text-sm flex items-center gap-1"
                                    title="Shuffle this item"
                                  >
                                    <Shuffle className="w-3 h-3" />
                                  </button>
                                  {todaysPlan.hazel.extras.length > 1 && (
                                    <button
                                      onClick={() => removeSlot('hazel', 'extras', idx)}
                                      className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
                                      title="Remove this item"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Confirm Plan Button */}
                  <div className="flex justify-center pt-8">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
                      <div className="text-center mb-4">
                        <h3 className="text-lg font-semibold text-green-800 mb-2">✅ Ready to pack?</h3>
                        <p className="text-green-700 text-sm">This will save your lunch plan to history</p>
                      </div>
                      <button
                        onClick={confirmPlan}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl hover:from-green-700 hover:to-emerald-700 flex items-center gap-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 mx-auto"
                      >
                        <CheckCircle className="w-6 h-6" />
                        Pack These Lunches!
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-300">
                  <div className="bg-blue-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Clock className="w-12 h-12 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-3">No lunch plan yet</h3>
                  <p className="text-gray-500 max-w-md mx-auto mb-6">Click "Generate Plan" above to create personalized lunch recommendations for Amelia and Hazel based on their preferences.</p>
                  <div className="text-sm text-gray-400">
                    💡 Tip: Plans consider food ratings, prep time, and current stock levels
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-6">Lunch History</h2>
              {lunchHistory.length > 0 ? (
                <div className="space-y-4">
                  {lunchHistory.slice(showAllHistory ? -lunchHistory.length : -10).reverse().map((day, idx) => (
                    <div key={idx} className="bg-white border-2 border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                      {/* Date Header */}
                      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-3 rounded-t-xl border-b border-gray-200">
                        <h3 className="font-semibold text-lg text-gray-800 text-center">
                          {formatDateWithDay(day.date)}
                        </h3>
                      </div>
                      
                      {/* Lunch Content */}
                      <div className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Amelia's Lunch */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                              <h4 className="font-semibold text-purple-700">Amelia's Lunch</h4>
                            </div>
                            <div className="space-y-1">
                              {day.amelia.map((item, i) => (
                                <div key={i} className={`p-2 rounded-lg border-l-4 ${getSlotColor(item.slot)}`}>
                                  <div className="flex justify-between items-center">
                                    <span className="font-medium text-xs uppercase tracking-wide opacity-75">
                                      {item.slot === 'crunchAndSip' ? 'Crunch & Sip' : item.slot}
                                    </span>
                                  </div>
                                  <div className="font-medium text-sm mt-1">{item.name}</div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Hazel's Lunch */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                              <h4 className="font-semibold text-pink-700">Hazel's Lunch</h4>
                            </div>
                            <div className="space-y-1">
                              {day.hazel.map((item, i) => (
                                <div key={i} className={`p-2 rounded-lg border-l-4 ${getSlotColor(item.slot)}`}>
                                  <div className="flex justify-between items-center">
                                    <span className="font-medium text-xs uppercase tracking-wide opacity-75">
                                      {item.slot === 'crunchAndSip' ? 'Crunch & Sip' : item.slot}
                                    </span>
                                  </div>
                                  <div className="font-medium text-sm mt-1">{item.name}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Show More/Less Button */}
                  {lunchHistory.length > 10 && (
                    <div className="text-center mt-6">
                      <button
                        onClick={() => setShowAllHistory(!showAllHistory)}
                        className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 px-6 py-3 rounded-lg hover:from-indigo-200 hover:to-purple-200 flex items-center gap-2 mx-auto font-medium border-2 border-indigo-200 transition-all duration-200"
                      >
                        {showAllHistory ? (
                          <>
                            Show Less
                            <div className="text-xs bg-indigo-200 px-2 py-1 rounded-full">
                              Hide {lunchHistory.length - 10} older
                            </div>
                          </>
                        ) : (
                          <>
                            Show More
                            <div className="text-xs bg-indigo-200 px-2 py-1 rounded-full">
                              +{lunchHistory.length - 10} more
                            </div>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-300">
                  <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">No lunch history yet</h3>
                  <p className="text-gray-500 max-w-sm mx-auto">Start planning lunches to see your history here. Each confirmed plan will be saved for future reference.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'foods' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Manage Food Options</h2>
              
              {/* Shopping List Summary */}
              {(foods.filter(f => isRunningLow(f)).length > 0 || archivedFoods.length > 0) && (
                <div className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-xl p-6 mb-6">
                  <h3 className="text-lg font-bold text-orange-800 mb-4 flex items-center gap-2">
                    🛒 Shopping List Summary
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Low Stock Items */}
                    {foods.filter(f => isRunningLow(f)).length > 0 && (
                      <div>
                        <h4 className="font-semibold text-red-700 mb-2 flex items-center gap-1">
                          <AlertTriangle className="w-4 h-4" />
                          Running Low ({foods.filter(f => isRunningLow(f)).length} items)
                        </h4>
                        <ul className="space-y-1">
                          {foods.filter(f => isRunningLow(f)).map(food => (
                            <li key={food.id} className="text-sm text-red-600 flex justify-between">
                              <span>• {food.name}</span>
                              <span className="font-medium">{food.servings} left</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {/* Out of Stock Items */}
                    {archivedFoods.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-1">
                          <Archive className="w-4 h-4" />
                          Out of Stock ({archivedFoods.length} items)
                        </h4>
                        <ul className="space-y-1">
                          {archivedFoods.slice(0, 5).map(food => (
                            <li key={food.id} className="text-sm text-gray-600">
                              • {food.name}
                            </li>
                          ))}
                          {archivedFoods.length > 5 && (
                            <li className="text-sm text-gray-500 italic">
                              + {archivedFoods.length - 5} more items
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-orange-200">
                    <p className="text-sm text-orange-700">
                      💡 Copy these items to your shopping app before heading to the store!
                    </p>
                  </div>
                </div>
              )}
              
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="font-medium mb-4">Add New Food</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Food name"
                    value={newFood.name}
                    onChange={(e) => setNewFood({...newFood, name: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                  />
                  
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={newFood.category}
                      onChange={(e) => setNewFood({...newFood, category: e.target.value})}
                      className="p-2 border rounded-lg"
                    >
                      <option value="snack">Snack/Side</option>
                      <option value="fruit">Fruit</option>
                      <option value="main">Main</option>
                      <option value="veggie">Veggie</option>
                    </select>
                    
                    <select
                      value={newFood.prep}
                      onChange={(e) => setNewFood({...newFood, prep: e.target.value})}
                      className="p-2 border rounded-lg"
                    >
                      <option value="none">No prep</option>
                      <option value="low">Low prep</option>
                      <option value="medium">Medium prep</option>
                      <option value="high">High prep</option>
                    </select>
                  </div>

                  <input
                    type="number"
                    placeholder="Servings (optional - leave empty for unlimited)"
                    value={newFood.servings || ''}
                    onChange={(e) => setNewFood({...newFood, servings: e.target.value ? parseInt(e.target.value) : null})}
                    className="w-full p-2 border rounded-lg text-sm"
                    min="0"
                  />

                  <div className="space-y-2">
                    <StarRating 
                      rating={newFood.ameliaRating} 
                      onChange={(rating) => setNewFood({...newFood, ameliaRating: rating})}
                      label="Amelia"
                    />
                    <StarRating 
                      rating={newFood.hazelRating} 
                      onChange={(rating) => setNewFood({...newFood, hazelRating: rating})}
                      label="Hazel"
                    />
                    <StarRating 
                      rating={newFood.healthRating} 
                      onChange={(rating) => setNewFood({...newFood, healthRating: rating})}
                      label="Health"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Tags (for variety)</label>
                    {newFood.tags.map((tag, idx) => (
                      <div key={idx} className="flex gap-2 mb-2">
                        <select
                          value={tag}
                          onChange={(e) => updateNewFoodTag(idx, e.target.value)}
                          className="flex-1 p-2 border rounded-lg"
                        >
                          <option value="">Select tag</option>
                          {availableTags.map(availableTag => (
                            <option key={availableTag} value={availableTag}>{availableTag}</option>
                          ))}
                        </select>
                        <button
                          onClick={() => removeNewFoodTag(idx)}
                          className="text-red-500 hover:text-red-700"
                          type="button"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={addNewFoodTag}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                      type="button"
                    >
                      + Add tag
                    </button>
                  </div>
                </div>
                
                <button
                  onClick={addFood}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Add Food
                </button>
              </div>

              {/* Enhanced Search & Filter Section */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                  🔍 Search & Filter Foods
                </h3>
                
                {/* Search Bar */}
                <div className="mb-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search by name, category, or tags..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 pl-10"
                    />
                    <div className="absolute left-3 top-3.5 text-gray-400">
                      🔍
                    </div>
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Rating Filters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Amelia's Rating</label>
                    <select
                      value={filters.ameliaRating}
                      onChange={(e) => setFilters({...filters, ameliaRating: parseInt(e.target.value)})}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500"
                    >
                      <option value={0}>Any rating</option>
                      <option value={5}>⭐⭐⭐⭐⭐ (5 stars)</option>
                      <option value={4}>⭐⭐⭐⭐ (4 stars)</option>
                      <option value={3}>⭐⭐⭐ (3 stars)</option>
                      <option value={2}>⭐⭐ (2 stars)</option>
                      <option value={1}>⭐ (1 star)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hazel's Rating</label>
                    <select
                      value={filters.hazelRating}
                      onChange={(e) => setFilters({...filters, hazelRating: parseInt(e.target.value)})}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500"
                    >
                      <option value={0}>Any rating</option>
                      <option value={5}>⭐⭐⭐⭐⭐ (5 stars)</option>
                      <option value={4}>⭐⭐⭐⭐ (4 stars)</option>
                      <option value={3}>⭐⭐⭐ (3 stars)</option>
                      <option value={2}>⭐⭐ (2 stars)</option>
                      <option value={1}>⭐ (1 star)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Health Rating</label>
                    <select
                      value={filters.healthRating}
                      onChange={(e) => setFilters({...filters, healthRating: parseInt(e.target.value)})}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500"
                    >
                      <option value={0}>Any health rating</option>
                      <option value={5}>💚💚💚💚💚 (Very healthy)</option>
                      <option value={4}>💚💚💚💚 (Healthy)</option>
                      <option value={3}>💚💚💚 (Moderate)</option>
                      <option value={2}>💚💚 (Treat)</option>
                      <option value={1}>💚 (Occasional)</option>
                    </select>
                  </div>
                </div>
                
                {/* Filter Summary & Clear */}
                <div className="mt-4 flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    {(() => {
                      const totalFiltered = filterFoodsBySearch(foods).length;
                      const activeFilters = [
                        searchQuery && 'search',
                        filters.ameliaRating > 0 && 'Amelia rating',
                        filters.hazelRating > 0 && 'Hazel rating', 
                        filters.healthRating > 0 && 'health rating'
                      ].filter(Boolean);
                      
                      if (activeFilters.length === 0) {
                        return `Showing all ${foods.length} foods`;
                      } else {
                        return `Showing ${totalFiltered} of ${foods.length} foods (filtered by: ${activeFilters.join(', ')})`;
                      }
                    })()}
                  </div>
                  
                  {(searchQuery || filters.ameliaRating > 0 || filters.hazelRating > 0 || filters.healthRating > 0) && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setFilters({
                          ameliaRating: 0,
                          hazelRating: 0,
                          healthRating: 0,
                          category: 'all'
                        });
                      }}
                      className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
                    >
                      Clear All Filters
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                {['snack', 'fruit', 'main', 'veggie'].map(category => {
                  const categoryFoods = filterFoodsBySearch(foods.filter(f => f.category === category));
                  if (categoryFoods.length === 0) return null;
                  
                  return (
                  <div key={category} className="border-2 border-gray-200 rounded-xl p-6 bg-gradient-to-r from-gray-50 to-white">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-200 capitalize">
                      {category === 'snack' ? '🍿 Snacks & Sides' : 
                       category === 'fruit' ? '🍎 Fruits' :
                       category === 'main' ? '🍽️ Main Dishes' : '🥕 Vegetables'} Options
                       <span className="text-sm font-normal text-gray-500 ml-2">({categoryFoods.length})</span>
                    </h3>
                    <div className="grid gap-3">
                      {categoryFoods.map(food => (
                        <div key={food.id} className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                <h4 className="font-semibold text-lg text-gray-800">{food.name}</h4>
                                {food.servings !== null && food.servings !== undefined && (
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    isRunningLow(food) ? 'bg-red-100 text-red-700' : 
                                    food.servings === 0 ? 'bg-gray-100 text-gray-500' : 
                                    food.servings > 10 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                  }`}>
                                    {food.servings} {food.servings === 1 ? 'serving' : 'servings'}
                                  </span>
                                )}
                                {(() => {
                                  const usageCount = getFoodUsageFrequency(food.id);
                                  if (usageCount > 0) {
                                    return (
                                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                        📊 {usageCount}x last 2 weeks
                                      </span>
                                    );
                                  }
                                  return null;
                                })()}
                              </div>
                              {isRunningLow(food) && (
                                <div className="mt-2">
                                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-red-100 text-red-800 font-medium">
                                    <AlertTriangle className="w-4 h-4" />
                                    Running Low - Add to Shopping List
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => setEditingFood(food)}
                                className="text-blue-500 hover:text-blue-700"
                                title="Edit food"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => archiveFood(food.id)}
                                className="text-orange-500 hover:text-orange-700"
                                title="Mark as out of stock"
                              >
                                <Archive className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteFood(food.id)}
                                className="text-red-500 hover:text-red-700"
                                title="Delete permanently"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <StarRating rating={food.ameliaRating} label="Amelia" readOnly />
                              <StarRating rating={food.hazelRating} label="Hazel" readOnly />
                              <StarRating rating={food.healthRating} label="Health" readOnly />
                            </div>
                            <div className="space-y-2">
                              <div className="flex flex-wrap gap-1">
                                <PrepBadge prep={food.prep} />
                                <HealthBadge rating={food.healthRating} />
                              </div>
                              <TagBadges tags={food.tags} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  );
                })}
              </div>

              {/* Out of Stock Section */}
              {archivedFoods.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4 text-gray-700">Out of Stock Foods</h3>
                  <div className="space-y-4">
                    {['snack', 'fruit', 'main', 'veggie'].map(category => {
                      const categoryFoods = archivedFoods.filter(f => f.category === category);
                      if (categoryFoods.length === 0) return null;
                      
                      return (
                        <div key={category} className="border rounded-lg p-4 bg-gray-50">
                          <h4 className="font-medium mb-3 capitalize text-gray-600">
                            {category === 'snack' ? 'Snacks & Sides' : category} (Out of Stock)
                          </h4>
                          <div className="grid gap-3">
                            {categoryFoods.map(food => (
                              <div key={food.id} className="bg-white p-3 rounded-lg border border-gray-200">
                                <div className="flex justify-between items-start mb-2">
                                  <h5 className="font-medium text-gray-700">{food.name}</h5>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => restoreFood(food.id)}
                                      className="text-green-500 hover:text-green-700"
                                      title="Mark as back in stock"
                                    >
                                      <RotateCcw className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => deleteFood(food.id, true)}
                                      className="text-red-500 hover:text-red-700"
                                      title="Delete permanently"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                  <div className="space-y-1">
                                    <StarRating rating={food.ameliaRating} label="Amelia" readOnly />
                                    <StarRating rating={food.hazelRating} label="Hazel" readOnly />
                                    <StarRating rating={food.healthRating} label="Health" readOnly />
                                  </div>
                                  <div className="space-y-2">
                                    <div className="flex flex-wrap gap-1">
                                      <PrepBadge prep={food.prep} />
                                      <HealthBadge rating={food.healthRating} />
                                    </div>
                                    <TagBadges tags={food.tags} />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'tags' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Manage Tags</h2>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="font-medium mb-4">Add New Tag</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Tag name (e.g. spicy, sweet, crunchy)"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="flex-1 p-2 border rounded-lg"
                  />
                  <button
                    onClick={() => {
                      if (newTag.trim() && !availableTags.includes(newTag.trim().toLowerCase())) {
                        setAvailableTags([...availableTags, newTag.trim().toLowerCase()]);
                        setNewTag('');
                      }
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Add Tag
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Available Tags</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {availableTags.map(tag => (
                    <div key={tag} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                      <span className="capitalize">{tag}</span>
                      <button
                        onClick={() => setConfirmDeleteTag(tag)}
                        className="text-red-500 hover:text-red-700 ml-2"
                        title="Delete tag"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'help' && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-6 mb-6 border border-cyan-200">
                <h2 className="text-2xl font-bold text-cyan-800 mb-2">🎯 How to Use Lunchbox Manager</h2>
                <p className="text-cyan-600">Your guide to stress-free, ADHD-friendly lunch planning!</p>
              </div>

              <div className="space-y-6">
                {/* Quick Start */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-green-700 mb-4 flex items-center gap-2">
                    🚀 Quick Start
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full">1</span>
                      <p><strong>Generate Plan:</strong> Click "Generate Plan" to create smart lunch recommendations for both kids</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full">2</span>
                      <p><strong>Customize:</strong> Don't like something? Use the shuffle buttons to swap individual items or shuffle everything</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full">3</span>
                      <p><strong>Pack & Go:</strong> When you're happy, click "Pack These Lunches!" to save them to history</p>
                    </div>
                  </div>
                </div>

                {/* Smart Features */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-blue-700 mb-4 flex items-center gap-2">
                    🧠 Smart Features
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">⭐ Kid Preferences</h4>
                      <p className="text-sm text-gray-600">Plans prioritize foods each kid actually likes (higher star ratings)</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">🔄 Variety Boost</h4>
                      <p className="text-sm text-gray-600">Avoids repeating foods from the last 2 days automatically</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">🍪 Treat Days</h4>
                      <p className="text-sm text-gray-600">Monday (Hazel), Thursday (Amelia), Friday (Both kids)</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">🍴 Helper Tags</h4>
                      <p className="text-sm text-gray-600">Spots foods that need cutlery, are crunchy, soft, etc.</p>
                    </div>
                  </div>
                </div>

                {/* Buttons Guide */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-purple-700 mb-4 flex items-center gap-2">
                    🎛️ Button Guide
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm font-medium">Generate Plan</div>
                      <p className="text-sm">Creates a completely new lunch plan using smart preferences</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-lg text-sm font-medium">Shuffle Everything</div>
                      <p className="text-sm">Randomly changes ALL items in one kid's lunchbox</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-sm font-medium">🔄</div>
                      <p className="text-sm">Swaps just one specific item (appears next to each food)</p>
                    </div>
                  </div>
                </div>

                {/* Food Management */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-orange-700 mb-4 flex items-center gap-2">
                    🍎 Managing Foods
                  </h3>
                  <div className="space-y-3">
                    <p><strong>Add Foods:</strong> Use the "Manage Foods" tab to add new items with ratings for each kid</p>
                    <p><strong>Stock Levels:</strong> Set serving counts for packaged items - when you run low, you'll see warnings</p>
                    <p><strong>Archive Items:</strong> Hide foods you're out of without deleting them permanently</p>
                    <p><strong>Star Ratings:</strong> 5 = loves it, 3 = okay, 1 = will eat if necessary, 0 = never include</p>
                  </div>
                </div>

                {/* Tips */}
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200 p-6">
                  <h3 className="text-lg font-semibold text-yellow-800 mb-4 flex items-center gap-2">
                    💡 Pro Tips
                  </h3>
                  <div className="space-y-2 text-sm text-yellow-700">
                    <p>• The app avoids 0-star foods completely, so rate honestly!</p>
                    <p>• Higher-rated main dishes = fewer side items (assumes kids will eat more)</p>
                    <p>• Check the History tab to see what worked well before</p>
                    <p>• Use tags like "🍴 needs-cutlery" to remember important details</p>
                    <p>• The app gets smarter as you use it - ratings and history matter!</p>
                  </div>
                </div>

                {/* Troubleshooting */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-red-700 mb-4 flex items-center gap-2">
                    🔧 Common Questions
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p><strong>Q: Why isn't my favorite food showing up?</strong></p>
                      <p className="text-gray-600 ml-4">A: Check it's not archived and has a rating above 0 for that child</p>
                    </div>
                    <div>
                      <p><strong>Q: Can I pack lunches for the same date twice?</strong></p>
                      <p className="text-gray-600 ml-4">A: The app will warn you and ask if you want to replace the existing plan</p>
                    </div>
                    <div>
                      <p><strong>Q: How does the "variety" feature work?</strong></p>
                      <p className="text-gray-600 ml-4">A: It looks at the last 2 days and makes recently used foods less likely to be selected</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-6 mb-6 border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">⚙️ Settings & Data Management</h2>
                <p className="text-gray-600">Configure smart planning weights and manage your data</p>
              </div>

              <div className="space-y-6">
                {/* Smart Planning Weights */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-blue-700 mb-4 flex items-center gap-2">
                    🧠 Smart Planning Weights
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Adjust how the app prioritizes foods when generating lunch plans. All weights should add up to 100%.
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Kid Preferences: {smartPlanningWeights.preferenceWeight}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={smartPlanningWeights.preferenceWeight}
                        onChange={(e) => setSmartPlanningWeights({
                          ...smartPlanningWeights,
                          preferenceWeight: parseInt(e.target.value)
                        })}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <p className="text-xs text-gray-500 mt-1">How much the star ratings matter</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Variety/History Avoidance: {smartPlanningWeights.varietyWeight}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={smartPlanningWeights.varietyWeight}
                        onChange={(e) => setSmartPlanningWeights({
                          ...smartPlanningWeights,
                          varietyWeight: parseInt(e.target.value)
                        })}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <p className="text-xs text-gray-500 mt-1">How much to avoid recently used foods</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Usage Frequency: {smartPlanningWeights.frequencyWeight}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={smartPlanningWeights.frequencyWeight}
                        onChange={(e) => setSmartPlanningWeights({
                          ...smartPlanningWeights,
                          frequencyWeight: parseInt(e.target.value)
                        })}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <p className="text-xs text-gray-500 mt-1">Promote unused foods or popular ones</p>
                    </div>
                    
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">
                        <strong>Total:</strong> {smartPlanningWeights.preferenceWeight + smartPlanningWeights.varietyWeight + smartPlanningWeights.frequencyWeight}%
                        {(smartPlanningWeights.preferenceWeight + smartPlanningWeights.varietyWeight + smartPlanningWeights.frequencyWeight) !== 100 && (
                          <span className="text-orange-600 ml-2">⚠️ Should total 100%</span>
                        )}
                      </p>
                    </div>
                    
                    <button
                      onClick={() => setSmartPlanningWeights({
                        preferenceWeight: 70,
                        varietyWeight: 20,
                        frequencyWeight: 10
                      })}
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 text-sm"
                    >
                      Reset to Defaults
                    </button>
                  </div>
                </div>

                {/* App Settings */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-purple-700 mb-4 flex items-center gap-2">
                    ⚙️ App Settings
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Configure app behavior and display preferences.
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Maximum History Days: {appSettings.maxHistoryDays}
                      </label>
                      <input
                        type="range"
                        min="30"
                        max="365"
                        value={appSettings.maxHistoryDays}
                        onChange={(e) => setAppSettings({
                          ...appSettings,
                          maxHistoryDays: parseInt(e.target.value)
                        })}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <p className="text-xs text-gray-500 mt-1">How long to keep lunch history (30-365 days)</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Auto-Archive Threshold: {appSettings.autoArchiveThreshold} days
                      </label>
                      <input
                        type="range"
                        min="14"
                        max="180"
                        value={appSettings.autoArchiveThreshold}
                        onChange={(e) => setAppSettings({
                          ...appSettings,
                          autoArchiveThreshold: parseInt(e.target.value)
                        })}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <p className="text-xs text-gray-500 mt-1">Suggest archiving foods unused for this many days</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Default Servings: {appSettings.defaultServings}
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={appSettings.defaultServings}
                        onChange={(e) => setAppSettings({
                          ...appSettings,
                          defaultServings: parseInt(e.target.value)
                        })}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <p className="text-xs text-gray-500 mt-1">Default servings when adding new foods</p>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="showUsageInPlanning"
                        checked={appSettings.showUsageInPlanning}
                        onChange={(e) => setAppSettings({
                          ...appSettings,
                          showUsageInPlanning: e.target.checked
                        })}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <label htmlFor="showUsageInPlanning" className="text-sm font-medium text-gray-700">
                        Show usage frequency in planning view
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="compactMode"
                        checked={appSettings.compactMode}
                        onChange={(e) => setAppSettings({
                          ...appSettings,
                          compactMode: e.target.checked
                        })}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <label htmlFor="compactMode" className="text-sm font-medium text-gray-700">
                        Use compact display mode
                      </label>
                    </div>
                    
                    <div className="border-t pt-4 mt-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">Default Lunch Plan Slots</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Main Items: {appSettings.defaultSlots.main}
                          </label>
                          <input
                            type="range"
                            min="1"
                            max="3"
                            value={appSettings.defaultSlots.main}
                            onChange={(e) => setAppSettings({
                              ...appSettings,
                              defaultSlots: {
                                ...appSettings.defaultSlots,
                                main: parseInt(e.target.value)
                              }
                            })}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Recess Items: {appSettings.defaultSlots.recess}
                          </label>
                          <input
                            type="range"
                            min="1"
                            max="5"
                            value={appSettings.defaultSlots.recess}
                            onChange={(e) => setAppSettings({
                              ...appSettings,
                              defaultSlots: {
                                ...appSettings.defaultSlots,
                                recess: parseInt(e.target.value)
                              }
                            })}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Extra Items: {appSettings.defaultSlots.extras}
                          </label>
                          <input
                            type="range"
                            min="1"
                            max="5"
                            value={appSettings.defaultSlots.extras}
                            onChange={(e) => setAppSettings({
                              ...appSettings,
                              defaultSlots: {
                                ...appSettings.defaultSlots,
                                extras: parseInt(e.target.value)
                              }
                            })}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Crunch & Sip: {appSettings.defaultSlots.crunchSip}
                          </label>
                          <input
                            type="range"
                            min="1"
                            max="3"
                            value={appSettings.defaultSlots.crunchSip}
                            onChange={(e) => setAppSettings({
                              ...appSettings,
                              defaultSlots: {
                                ...appSettings.defaultSlots,
                                crunchSip: parseInt(e.target.value)
                              }
                            })}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">These control how many item slots new lunch plans will have by default</p>
                    </div>
                    
                    <button
                      onClick={() => setAppSettings({
                        maxHistoryDays: 90,
                        autoArchiveThreshold: 60,
                        defaultServings: 1,
                        showUsageInPlanning: true,
                        compactMode: false,
                        defaultSlots: {
                          main: 1,
                          recess: 2,
                          extras: 2,
                          crunchSip: 1
                        }
                      })}
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 text-sm"
                    >
                      Reset to Defaults
                    </button>
                  </div>
                </div>

                {/* Data Export/Import */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-green-700 mb-4 flex items-center gap-2">
                    💾 Data Backup & Restore
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Export your foods, history, tags, and settings as a JSON file for backup or migration.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={exportData}
                      className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center gap-2 font-medium"
                    >
                      <Download className="w-4 h-4" />
                      Export All Data
                    </button>
                    
                    <div className="relative">
                      <input
                        type="file"
                        accept=".json"
                        onChange={importData}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        id="import-file"
                      />
                      <label
                        htmlFor="import-file"
                        className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 flex items-center gap-2 font-medium cursor-pointer inline-flex"
                      >
                        <Upload className="w-4 h-4" />
                        Import Data
                      </label>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="font-medium text-yellow-800 mb-2">⚠️ Important Notes:</h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• Export creates a complete backup of all your data</li>
                      <li>• Import will replace ALL existing data permanently</li>
                      <li>• Always export a backup before importing new data</li>
                      <li>• File format is standard JSON - readable and portable</li>
                    </ul>
                  </div>
                </div>

                {/* App Info */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-purple-700 mb-4 flex items-center gap-2">
                    📱 App Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p><strong>Total Foods:</strong> {foods.length}</p>
                      <p><strong>Archived Foods:</strong> {archivedFoods.length}</p>
                      <p><strong>Available Tags:</strong> {availableTags.length}</p>
                    </div>
                    <div>
                      <p><strong>Lunch History:</strong> {lunchHistory.length} days</p>
                      <p><strong>App Version:</strong> 1.1.0</p>
                      <p><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LunchboxManager;
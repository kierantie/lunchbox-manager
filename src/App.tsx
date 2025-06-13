import React, { useState, useEffect } from 'react';
import { Plus, Trash2, RefreshCw, Calendar, Clock, CheckCircle, Archive, RotateCcw, Star, Edit, X, Shuffle, AlertTriangle } from 'lucide-react';

const LunchboxManager = () => {
  const [foods, setFoods] = useState([]);
  const [archivedFoods, setArchivedFoods] = useState([]);
  const [lunchHistory, setLunchHistory] = useState([]);
  const [todaysPlan, setTodaysPlan] = useState(null);
  const [planDate, setPlanDate] = useState('today');
  const [activeTab, setActiveTab] = useState('plan');
  const [editingFood, setEditingFood] = useState(null);
  const [availableTags, setAvailableTags] = useState(['fruity', 'savoury', 'crunchy', 'chewy', 'soft', 'treat']);
  const [newTag, setNewTag] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
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

  // Initialize sample data
  useEffect(() => {
    if (foods.length === 0) {
      const sampleFoods = [
        { id: 1, name: 'Rice crackers', category: 'snack', prep: 'none', ameliaRating: 5, hazelRating: 5, healthRating: 3, tags: ['crunchy', 'savoury'], available: true, servings: 10 },
        { id: 2, name: 'Mamee noodles', category: 'snack', prep: 'none', ameliaRating: 4, hazelRating: 4, healthRating: 2, tags: ['crunchy', 'savoury'], available: true, servings: 2 },
        { id: 3, name: 'Soy crisps', category: 'snack', prep: 'none', ameliaRating: 4, hazelRating: 3, healthRating: 3, tags: ['crunchy', 'savoury'], available: true, servings: 8 },
        { id: 4, name: 'Fruit pouch', category: 'snack', prep: 'none', ameliaRating: 3, hazelRating: 4, healthRating: 4, tags: ['fruity', 'chewy'], available: true, servings: 6 },
        { id: 5, name: 'Mini cookies', category: 'snack', prep: 'none', ameliaRating: 5, hazelRating: 5, healthRating: 1, tags: ['treat', 'soft'], available: true, servings: 20 },
        { id: 6, name: 'Seaweed snacks', category: 'snack', prep: 'none', ameliaRating: 2, hazelRating: 4, healthRating: 4, tags: ['savoury', 'crunchy'], available: true, servings: 15 },
        { id: 7, name: 'Apple slices', category: 'fruit', prep: 'low', ameliaRating: 4, hazelRating: 5, healthRating: 5, tags: ['fruity', 'crunchy'], available: true, servings: null },
        { id: 8, name: 'Banana', category: 'fruit', prep: 'none', ameliaRating: 3, hazelRating: 4, healthRating: 5, tags: ['fruity', 'soft'], available: true, servings: null },
        { id: 9, name: 'Grapes', category: 'fruit', prep: 'none', ameliaRating: 5, hazelRating: 3, healthRating: 4, tags: ['fruity', 'soft'], available: true, servings: null },
        { id: 10, name: 'Orange segments', category: 'fruit', prep: 'low', ameliaRating: 3, hazelRating: 5, healthRating: 5, tags: ['fruity', 'soft'], available: true, servings: null },
        { id: 11, name: 'Buttery spaghetti', category: 'main', prep: 'high', ameliaRating: 5, hazelRating: 4, healthRating: 3, tags: ['savoury', 'soft'], available: true, servings: null },
        { id: 12, name: 'Rice with furikake', category: 'main', prep: 'medium', ameliaRating: 4, hazelRating: 5, healthRating: 4, tags: ['savoury', 'soft'], available: true, servings: null },
        { id: 13, name: 'Chicken nuggets', category: 'main', prep: 'medium', ameliaRating: 5, hazelRating: 4, healthRating: 3, tags: ['savoury', 'crunchy'], available: true, servings: null },
        { id: 14, name: 'Sandwich rolls', category: 'main', prep: 'low', ameliaRating: 3, hazelRating: 3, healthRating: 4, tags: ['savoury', 'soft'], available: true, servings: null },
        { id: 15, name: 'Carrot sticks', category: 'veggie', prep: 'low', ameliaRating: 3, hazelRating: 3, healthRating: 5, tags: ['savoury', 'crunchy'], available: true, servings: null },
        { id: 16, name: 'Cucumber slices', category: 'veggie', prep: 'low', ameliaRating: 4, hazelRating: 2, healthRating: 5, tags: ['savoury', 'crunchy'], available: true, servings: null },
        { id: 17, name: 'Cherry tomatoes', category: 'veggie', prep: 'none', ameliaRating: 2, hazelRating: 4, healthRating: 5, tags: ['savoury', 'soft'], available: true, servings: null },
        { id: 18, name: 'Bell pepper strips', category: 'veggie', prep: 'low', ameliaRating: 3, hazelRating: 3, healthRating: 5, tags: ['savoury', 'crunchy'], available: true, servings: null }
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

  const generateRecommendations = () => {
    const availableSnacks = foods.filter(f => f.category === 'snack' && f.available !== false);
    const availableFruit = foods.filter(f => f.category === 'fruit' && f.available !== false);
    const availableMains = foods.filter(f => f.category === 'main' && f.available !== false);
    const availableVeggies = foods.filter(f => f.category === 'veggie' && f.available !== false);

    const getRandomItems = (items, count) => {
      const shuffled = [...items].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    };

    const plan = {
      date: getPlanDate(),
      amelia: {
        recess: getRandomItems([...availableSnacks, ...availableFruit], 3),
        crunchAndSip: getRandomItems(availableFruit, 1)[0] || availableFruit[0],
        main: getRandomItems(availableMains, 1)[0] || availableMains[0],
        veggie: getRandomItems(availableVeggies, 1)[0] || availableVeggies[0],
        extras: getRandomItems([...availableSnacks, ...availableFruit], 2)
      },
      hazel: {
        recess: getRandomItems([...availableSnacks, ...availableFruit], 3),
        crunchAndSip: getRandomItems(availableFruit, 1)[0] || availableFruit[0],
        main: getRandomItems(availableMains, 1)[0] || availableMains[0],
        veggie: getRandomItems(availableVeggies, 1)[0] || availableVeggies[0],
        extras: getRandomItems([...availableSnacks, ...availableFruit], 2)
      }
    };

    setTodaysPlan(plan);
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
    setFoods(foods.map(f => f.id === updatedFood.id ? updatedFood : f));
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

  const swapItem = (child, category, slot) => {
    if (!todaysPlan) return;

    const availableItems = foods.filter(f => {
      if (category === 'mixed') {
        return (f.category === 'snack' || f.category === 'fruit') && f.available !== false;
      }
      return f.category === category && f.available !== false;
    });

    const updatedPlan = { ...todaysPlan };
    
    if (slot === 'recess') {
      // For recess, regenerate the entire selection
      const getRandomItems = (items, count) => {
        const shuffled = [...items].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
      };
      updatedPlan[child][slot] = getRandomItems(availableItems, 3);
    } else {
      // For other items, swap individual items
      const currentItems = Array.isArray(todaysPlan[child][slot]) ? 
        todaysPlan[child][slot] : [todaysPlan[child][slot]];
      
      const unusedItems = availableItems.filter(item => 
        !currentItems.some(current => current && current.id === item.id)
      );

      if (unusedItems.length === 0) return;

      const newItem = unusedItems[Math.floor(Math.random() * unusedItems.length)];
      
      if (Array.isArray(updatedPlan[child][slot])) {
        const randomIndex = Math.floor(Math.random() * updatedPlan[child][slot].length);
        updatedPlan[child][slot] = [...updatedPlan[child][slot]];
        updatedPlan[child][slot][randomIndex] = newItem;
      } else {
        updatedPlan[child][slot] = newItem;
      }
    }

    setTodaysPlan(updatedPlan);
  };

  const confirmPlan = () => {
    if (todaysPlan) {
      const historyEntry = {
        date: todaysPlan.date,
        amelia: [
          ...todaysPlan.amelia.recess.map(item => ({...item, slot: 'recess'})),
          {...todaysPlan.amelia.crunchAndSip, slot: 'crunchAndSip'},
          {...todaysPlan.amelia.main, slot: 'main'},
          {...todaysPlan.amelia.veggie, slot: 'veggie'},
          ...todaysPlan.amelia.extras.map(item => ({...item, slot: 'extra'}))
        ],
        hazel: [
          ...todaysPlan.hazel.recess.map(item => ({...item, slot: 'recess'})),
          {...todaysPlan.hazel.crunchAndSip, slot: 'crunchAndSip'},
          {...todaysPlan.hazel.main, slot: 'main'},
          {...todaysPlan.hazel.veggie, slot: 'veggie'},
          ...todaysPlan.hazel.extras.map(item => ({...item, slot: 'extra'}))
        ]
      };
      setLunchHistory([...lunchHistory, historyEntry]);
      setTodaysPlan(null);
    }
  };

  const StarRating = ({ rating, onChange, label, readOnly = false }) => {
    return (
      <div className="flex items-center gap-1">
        <span className="text-sm text-gray-600 w-16">{label}:</span>
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
    <div className="max-w-7xl mx-auto p-4 bg-gray-50 min-h-screen">
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

      {/* Food Editor */}
      {editingFood && (
        <FoodEditor 
          food={editingFood} 
          onSave={updateFood} 
          onCancel={() => setEditingFood(null)} 
        />
      )}
      <div className="bg-white rounded-lg shadow-sm border mb-6">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Lunchbox Manager</h1>
          <p className="text-gray-600">ADHD-friendly lunch planning for Amelia & Hazel</p>
        </div>

        <div className="flex border-b overflow-x-auto">
          <button
            onClick={() => setActiveTab('plan')}
            className={`px-6 py-3 font-medium whitespace-nowrap ${activeTab === 'plan' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          >
            <Calendar className="w-4 h-4 inline mr-2" />
            Today's Plan
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-3 font-medium whitespace-nowrap ${activeTab === 'history' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          >
            <Clock className="w-4 h-4 inline mr-2" />
            History
          </button>
          <button
            onClick={() => setActiveTab('foods')}
            className={`px-6 py-3 font-medium whitespace-nowrap ${activeTab === 'foods' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          >
            <Plus className="w-4 h-4 inline mr-2" />
            Manage Foods
          </button>
          <button
            onClick={() => setActiveTab('tags')}
            className={`px-6 py-3 font-medium whitespace-nowrap ${activeTab === 'tags' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          >
            Manage Tags
          </button>
          <button
            onClick={() => setActiveTab('archived')}
            className={`px-6 py-3 font-medium whitespace-nowrap ${activeTab === 'archived' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          >
            <Archive className="w-4 h-4 inline mr-2" />
            Out of Stock ({archivedFoods.length})
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'plan' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Lunchbox Plan</h2>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Plan for:</label>
                    <select
                      value={planDate}
                      onChange={(e) => setPlanDate(e.target.value)}
                      className="border rounded px-2 py-1 text-sm"
                    >
                      <option value="today">Today</option>
                      <option value="tomorrow">Tomorrow</option>
                    </select>
                  </div>
                  <button
                    onClick={generateRecommendations}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Generate Plan
                  </button>
                </div>
              </div>

              {todaysPlan ? (
                <div className="space-y-6">
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-medium text-gray-700">Plan for {todaysPlan.date}</h3>
                  </div>
                  
                  <div className="grid lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-purple-600 border-b-2 border-purple-200 pb-2">
                        Amelia's Lunchbox
                      </h3>
                      
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-semibold text-blue-900 flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Recess (10 min)
                          </h4>
                          <button
                            onClick={() => swapItem('amelia', 'mixed', 'recess')}
                            className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                          >
                            <Shuffle className="w-3 h-3" />
                            Swap
                          </button>
                        </div>
                        <div className="space-y-2">
                          {todaysPlan.amelia.recess.map((item, idx) => (
                            <div key={idx} className="bg-white p-3 rounded border-l-2 border-blue-400">
                              <div className="font-medium">{item.name}</div>
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
                          ))}
                        </div>
                      </div>

                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-semibold text-yellow-900">Crunch & Sip</h4>
                          <button
                            onClick={() => swapItem('amelia', 'fruit', 'crunchAndSip')}
                            className="text-yellow-600 hover:text-yellow-800 text-sm flex items-center gap-1"
                          >
                            <Shuffle className="w-3 h-3" />
                            Swap
                          </button>
                        </div>
                        <div className="bg-white p-3 rounded border-l-2 border-yellow-400">
                          <div className="font-medium">{todaysPlan.amelia.crunchAndSip.name}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <StarRating rating={todaysPlan.amelia.crunchAndSip.ameliaRating} label="Rating" readOnly />
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            <PrepBadge prep={todaysPlan.amelia.crunchAndSip.prep} />
                            <HealthBadge rating={todaysPlan.amelia.crunchAndSip.healthRating} />
                          </div>
                          <TagBadges tags={todaysPlan.amelia.crunchAndSip.tags} />
                        </div>
                      </div>

                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Lunch (10 min eating)
                        </h4>
                        <div className="space-y-2">
                          <div className="bg-white p-3 rounded border-l-4 border-green-500">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="text-xs font-medium text-green-700 uppercase">Main</div>
                                <div className="font-medium">{todaysPlan.amelia.main.name}</div>
                                <div className="flex items-center gap-2 mt-1">
                                  <StarRating rating={todaysPlan.amelia.main.ameliaRating} label="Rating" readOnly />
                                </div>
                                <div className="flex flex-wrap gap-1 mt-2">
                                  <PrepBadge prep={todaysPlan.amelia.main.prep} />
                                  <HealthBadge rating={todaysPlan.amelia.main.healthRating} />
                                </div>
                                <TagBadges tags={todaysPlan.amelia.main.tags} />
                              </div>
                              <button
                                onClick={() => swapItem('amelia', 'main', 'main')}
                                className="text-green-600 hover:text-green-800 text-sm flex items-center gap-1 ml-2"
                              >
                                <Shuffle className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                          
                          <div className="bg-white p-3 rounded border-l-2 border-green-300">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="text-xs font-medium text-green-700 uppercase">Veggie</div>
                                <div className="font-medium">{todaysPlan.amelia.veggie.name}</div>
                                <div className="flex items-center gap-2 mt-1">
                                  <StarRating rating={todaysPlan.amelia.veggie.ameliaRating} label="Rating" readOnly />
                                </div>
                                <div className="flex flex-wrap gap-1 mt-2">
                                  <PrepBadge prep={todaysPlan.amelia.veggie.prep} />
                                  <HealthBadge rating={todaysPlan.amelia.veggie.healthRating} />
                                </div>
                                <TagBadges tags={todaysPlan.amelia.veggie.tags} />
                              </div>
                              <button
                                onClick={() => swapItem('amelia', 'veggie', 'veggie')}
                                className="text-green-600 hover:text-green-800 text-sm flex items-center gap-1 ml-2"
                              >
                                <Shuffle className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          {todaysPlan.amelia.extras.map((item, idx) => (
                            <div key={idx} className="bg-white p-3 rounded border-l-2 border-gray-300">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <div className="text-xs font-medium text-gray-700 uppercase">Extra</div>
                                  <div className="font-medium">{item.name}</div>
                                  <div className="flex items-center gap-2 mt-1">
                                    <StarRating rating={item.ameliaRating} label="Rating" readOnly />
                                  </div>
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    <PrepBadge prep={item.prep} />
                                    <HealthBadge rating={item.healthRating} />
                                  </div>
                                  <TagBadges tags={item.tags} />
                                </div>
                                <button
                                  onClick={() => swapItem('amelia', 'mixed', 'extras')}
                                  className="text-gray-600 hover:text-gray-800 text-sm flex items-center gap-1 ml-2"
                                >
                                  <Shuffle className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-pink-600 border-b-2 border-pink-200 pb-2">
                        Hazel's Lunchbox
                      </h3>
                      
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-semibold text-blue-900 flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Recess (10 min)
                          </h4>
                          <button
                            onClick={() => swapItem('hazel', 'mixed', 'recess')}
                            className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                          >
                            <Shuffle className="w-3 h-3" />
                            Swap
                          </button>
                        </div>
                        <div className="space-y-2">
                          {todaysPlan.hazel.recess.map((item, idx) => (
                            <div key={idx} className="bg-white p-3 rounded border-l-2 border-blue-400">
                              <div className="font-medium">{item.name}</div>
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
                          ))}
                        </div>
                      </div>

                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-semibold text-yellow-900">Crunch & Sip</h4>
                          <button
                            onClick={() => swapItem('hazel', 'fruit', 'crunchAndSip')}
                            className="text-yellow-600 hover:text-yellow-800 text-sm flex items-center gap-1"
                          >
                            <Shuffle className="w-3 h-3" />
                            Swap
                          </button>
                        </div>
                        <div className="bg-white p-3 rounded border-l-2 border-yellow-400">
                          <div className="font-medium">{todaysPlan.hazel.crunchAndSip.name}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <StarRating rating={todaysPlan.hazel.crunchAndSip.hazelRating} label="Rating" readOnly />
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            <PrepBadge prep={todaysPlan.hazel.crunchAndSip.prep} />
                            <HealthBadge rating={todaysPlan.hazel.crunchAndSip.healthRating} />
                          </div>
                          <TagBadges tags={todaysPlan.hazel.crunchAndSip.tags} />
                        </div>
                      </div>

                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Lunch (10 min eating)
                        </h4>
                        <div className="space-y-2">
                          <div className="bg-white p-3 rounded border-l-4 border-green-500">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="text-xs font-medium text-green-700 uppercase">Main</div>
                                <div className="font-medium">{todaysPlan.hazel.main.name}</div>
                                <div className="flex items-center gap-2 mt-1">
                                  <StarRating rating={todaysPlan.hazel.main.hazelRating} label="Rating" readOnly />
                                </div>
                                <div className="flex flex-wrap gap-1 mt-2">
                                  <PrepBadge prep={todaysPlan.hazel.main.prep} />
                                  <HealthBadge rating={todaysPlan.hazel.main.healthRating} />
                                </div>
                                <TagBadges tags={todaysPlan.hazel.main.tags} />
                              </div>
                              <button
                                onClick={() => swapItem('hazel', 'main', 'main')}
                                className="text-green-600 hover:text-green-800 text-sm flex items-center gap-1 ml-2"
                              >
                                <Shuffle className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                          
                          <div className="bg-white p-3 rounded border-l-2 border-green-300">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="text-xs font-medium text-green-700 uppercase">Veggie</div>
                                <div className="font-medium">{todaysPlan.hazel.veggie.name}</div>
                                <div className="flex items-center gap-2 mt-1">
                                  <StarRating rating={todaysPlan.hazel.veggie.hazelRating} label="Rating" readOnly />
                                </div>
                                <div className="flex flex-wrap gap-1 mt-2">
                                  <PrepBadge prep={todaysPlan.hazel.veggie.prep} />
                                  <HealthBadge rating={todaysPlan.hazel.veggie.healthRating} />
                                </div>
                                <TagBadges tags={todaysPlan.hazel.veggie.tags} />
                              </div>
                              <button
                                onClick={() => swapItem('hazel', 'veggie', 'veggie')}
                                className="text-green-600 hover:text-green-800 text-sm flex items-center gap-1 ml-2"
                              >
                                <Shuffle className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          {todaysPlan.hazel.extras.map((item, idx) => (
                            <div key={idx} className="bg-white p-3 rounded border-l-2 border-gray-300">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <div className="text-xs font-medium text-gray-700 uppercase">Extra</div>
                                  <div className="font-medium">{item.name}</div>
                                  <div className="flex items-center gap-2 mt-1">
                                    <StarRating rating={item.hazelRating} label="Rating" readOnly />
                                  </div>
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    <PrepBadge prep={item.prep} />
                                    <HealthBadge rating={item.healthRating} />
                                  </div>
                                  <TagBadges tags={item.tags} />
                                </div>
                                <button
                                  onClick={() => swapItem('hazel', 'mixed', 'extras')}
                                  className="text-gray-600 hover:text-gray-800 text-sm flex items-center gap-1 ml-2"
                                >
                                  <Shuffle className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <button
                      onClick={confirmPlan}
                      className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center gap-2 text-lg"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Pack These Lunches!
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Clock className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">No plan yet</h3>
                  <p className="text-gray-500">Select a date and click "Generate Plan" to get recommendations</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Lunch History</h2>
              {lunchHistory.length > 0 ? (
                <div className="space-y-6">
                  {lunchHistory.slice(-14).reverse().map((day, idx) => (
                    <div key={idx} className="border rounded-lg p-4 bg-white">
                      <h3 className="font-medium mb-4 text-center text-lg text-gray-700">{day.date}</h3>
                      <div className="grid lg:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium text-purple-600 mb-3">Amelia's Lunch</h4>
                          <div className="space-y-2 text-sm">
                            {day.amelia.map((item, i) => (
                              <div key={i} className="bg-gray-50 p-2 rounded">
                                <span className="font-medium text-xs text-gray-600 uppercase">{item.slot}</span>
                                <div>{item.name}</div>
                              </div>
                            ))}    
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-pink-600 mb-3">Hazel's Lunch</h4>
                          <div className="space-y-2 text-sm">
                            {day.hazel.map((item, i) => (
                              <div key={i} className="bg-gray-50 p-2 rounded">
                                <span className="font-medium text-xs text-gray-600 uppercase">{item.slot}</span>
                                <div>{item.name}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">No lunch history yet. Pack your first lunch!</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'foods' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Manage Food Options</h2>
              
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

              <div className="space-y-6">
                {['snack', 'fruit', 'main', 'veggie'].map(category => (
                  <div key={category} className="border rounded-lg p-4">
                    <h3 className="font-medium mb-3 capitalize">
                      {category === 'snack' ? 'Snacks & Sides' : category} Options
                    </h3>
                    <div className="grid gap-3">
                      {foods.filter(f => f.category === category).map(food => (
                        <div key={food.id} className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium flex items-center gap-2">
                              {food.name}
                              {isRunningLow(food) && (
                                <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800 flex items-center gap-1">
                                  <AlertTriangle className="w-3 h-3" />
                                  Low stock
                                </span>
                              )}
                              {food.servings !== null && food.servings !== undefined && (
                                <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                                  {food.servings} servings
                                </span>
                              )}
                            </h4>
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
                ))}
              </div>
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
                        onClick={() => {
                          setAvailableTags(availableTags.filter(t => t !== tag));
                          // Remove tag from all foods
                          setFoods(foods.map(f => ({...f, tags: f.tags.filter(t => t !== tag)})));
                        }}
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

          {activeTab === 'archived' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Out of Stock Foods</h2>
              {archivedFoods.length > 0 ? (
                <div className="space-y-6">
                  {['snack', 'fruit', 'main', 'veggie'].map(category => {
                    const categoryFoods = archivedFoods.filter(f => f.category === category);
                    if (categoryFoods.length === 0) return null;
                    
                    return (
                      <div key={category} className="border rounded-lg p-4 bg-gray-50">
                        <h3 className="font-medium mb-3 capitalize text-gray-600">
                          {category === 'snack' ? 'Snacks & Sides' : category} (Out of Stock)
                        </h3>
                        <div className="grid gap-3">
                          {categoryFoods.map(food => (
                            <div key={food.id} className="bg-white p-3 rounded-lg border border-gray-200">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium text-gray-700">{food.name}</h4>
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
              ) : (
                <div className="text-center py-12">
                  <Archive className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">No foods are currently out of stock</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LunchboxManager;
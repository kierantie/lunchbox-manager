"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var LunchboxManager = function () {
    var _a = (0, react_1.useState)([]), foods = _a[0], setFoods = _a[1];
    var _b = (0, react_1.useState)([]), archivedFoods = _b[0], setArchivedFoods = _b[1];
    var _c = (0, react_1.useState)([]), lunchHistory = _c[0], setLunchHistory = _c[1];
    var _d = (0, react_1.useState)(null), todaysPlan = _d[0], setTodaysPlan = _d[1];
    var _e = (0, react_1.useState)('today'), planDate = _e[0], setPlanDate = _e[1];
    var _f = (0, react_1.useState)('plan'), activeTab = _f[0], setActiveTab = _f[1];
    var _g = (0, react_1.useState)(null), editingFood = _g[0], setEditingFood = _g[1];
    var _h = (0, react_1.useState)(['fruity', 'savoury', 'crunchy', 'chewy', 'soft', 'treat']), availableTags = _h[0], setAvailableTags = _h[1];
    var _j = (0, react_1.useState)(''), newTag = _j[0], setNewTag = _j[1];
    var _k = (0, react_1.useState)(null), confirmDelete = _k[0], setConfirmDelete = _k[1];
    var _l = (0, react_1.useState)({
        name: '',
        category: 'snack',
        prep: 'none',
        ameliaRating: 3,
        hazelRating: 3,
        healthRating: 3,
        tags: [],
        available: true,
        servings: null
    }), newFood = _l[0], setNewFood = _l[1];
    // Initialize sample data
    (0, react_1.useEffect)(function () {
        if (foods.length === 0) {
            var sampleFoods = [
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
    var isRunningLow = function (food) {
        if (!food.servings)
            return false;
        return food.servings <= 3 && food.servings > 0;
    };
    var getPlanDate = function () {
        var today = new Date();
        if (planDate === 'tomorrow') {
            var tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            return tomorrow.toLocaleDateString();
        }
        return today.toLocaleDateString();
    };
    var generateRecommendations = function () {
        var availableSnacks = foods.filter(function (f) { return f.category === 'snack' && f.available !== false; });
        var availableFruit = foods.filter(function (f) { return f.category === 'fruit' && f.available !== false; });
        var availableMains = foods.filter(function (f) { return f.category === 'main' && f.available !== false; });
        var availableVeggies = foods.filter(function (f) { return f.category === 'veggie' && f.available !== false; });
        var getRandomItems = function (items, count) {
            var shuffled = __spreadArray([], items, true).sort(function () { return 0.5 - Math.random(); });
            return shuffled.slice(0, count);
        };
        var plan = {
            date: getPlanDate(),
            amelia: {
                recess: getRandomItems(__spreadArray(__spreadArray([], availableSnacks, true), availableFruit, true), 3),
                crunchAndSip: getRandomItems(availableFruit, 1)[0] || availableFruit[0],
                main: getRandomItems(availableMains, 1)[0] || availableMains[0],
                veggie: getRandomItems(availableVeggies, 1)[0] || availableVeggies[0],
                extras: getRandomItems(__spreadArray(__spreadArray([], availableSnacks, true), availableFruit, true), 2)
            },
            hazel: {
                recess: getRandomItems(__spreadArray(__spreadArray([], availableSnacks, true), availableFruit, true), 3),
                crunchAndSip: getRandomItems(availableFruit, 1)[0] || availableFruit[0],
                main: getRandomItems(availableMains, 1)[0] || availableMains[0],
                veggie: getRandomItems(availableVeggies, 1)[0] || availableVeggies[0],
                extras: getRandomItems(__spreadArray(__spreadArray([], availableSnacks, true), availableFruit, true), 2)
            }
        };
        setTodaysPlan(plan);
    };
    var addFood = function () {
        if (newFood.name.trim()) {
            var food = __assign(__assign({}, newFood), { id: Date.now(), tags: newFood.tags.filter(function (tag) { return tag.trim() !== ''; }), servings: newFood.servings });
            setFoods(__spreadArray(__spreadArray([], foods, true), [food], false));
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
    var updateFood = function (updatedFood) {
        setFoods(foods.map(function (f) { return f.id === updatedFood.id ? updatedFood : f; }));
        setEditingFood(null);
    };
    var archiveFood = function (id) {
        var food = foods.find(function (f) { return f.id === id; });
        if (food) {
            setFoods(foods.filter(function (f) { return f.id !== id; }));
            setArchivedFoods(__spreadArray(__spreadArray([], archivedFoods, true), [__assign(__assign({}, food), { available: false })], false));
        }
    };
    var restoreFood = function (id) {
        var food = archivedFoods.find(function (f) { return f.id === id; });
        if (food) {
            setArchivedFoods(archivedFoods.filter(function (f) { return f.id !== id; }));
            setFoods(__spreadArray(__spreadArray([], foods, true), [__assign(__assign({}, food), { available: true })], false));
        }
    };
    var deleteFood = function (id, isArchived) {
        if (isArchived === void 0) { isArchived = false; }
        setConfirmDelete({ id: id, isArchived: isArchived, type: 'food' });
    };
    var TagBadges = function (_a) {
        var _b = _a.tags, tags = _b === void 0 ? [] : _b;
        var tagColors = {
            'fruity': 'bg-pink-100 text-pink-800',
            'savoury': 'bg-blue-100 text-blue-800',
            'crunchy': 'bg-orange-100 text-orange-800',
            'chewy': 'bg-purple-100 text-purple-800',
            'soft': 'bg-gray-100 text-gray-800',
            'treat': 'bg-red-100 text-red-800'
        };
        return (<div className="flex flex-wrap gap-1">
        {tags.map(function (tag, idx) { return (<span key={idx} className={"px-2 py-1 rounded-full text-xs ".concat(tagColors[tag] || 'bg-gray-100 text-gray-800')}>
            {tag}
          </span>); })}
      </div>);
    };
    var swapItem = function (child, category, slot) {
        if (!todaysPlan)
            return;
        var availableItems = foods.filter(function (f) {
            if (category === 'mixed') {
                return (f.category === 'snack' || f.category === 'fruit') && f.available !== false;
            }
            return f.category === category && f.available !== false;
        });
        var updatedPlan = __assign({}, todaysPlan);
        if (slot === 'recess') {
            // For recess, regenerate the entire selection
            var getRandomItems = function (items, count) {
                var shuffled = __spreadArray([], items, true).sort(function () { return 0.5 - Math.random(); });
                return shuffled.slice(0, count);
            };
            updatedPlan[child][slot] = getRandomItems(availableItems, 3);
        }
        else {
            // For other items, swap individual items
            var currentItems_1 = Array.isArray(todaysPlan[child][slot]) ?
                todaysPlan[child][slot] : [todaysPlan[child][slot]];
            var unusedItems = availableItems.filter(function (item) {
                return !currentItems_1.some(function (current) { return current && current.id === item.id; });
            });
            if (unusedItems.length === 0)
                return;
            var newItem = unusedItems[Math.floor(Math.random() * unusedItems.length)];
            if (Array.isArray(updatedPlan[child][slot])) {
                var randomIndex = Math.floor(Math.random() * updatedPlan[child][slot].length);
                updatedPlan[child][slot] = __spreadArray([], updatedPlan[child][slot], true);
                updatedPlan[child][slot][randomIndex] = newItem;
            }
            else {
                updatedPlan[child][slot] = newItem;
            }
        }
        setTodaysPlan(updatedPlan);
    };
    var confirmPlan = function () {
        if (todaysPlan) {
            var historyEntry = {
                date: todaysPlan.date,
                amelia: __spreadArray(__spreadArray(__spreadArray([], todaysPlan.amelia.recess.map(function (item) { return (__assign(__assign({}, item), { slot: 'recess' })); }), true), [
                    __assign(__assign({}, todaysPlan.amelia.crunchAndSip), { slot: 'crunchAndSip' }),
                    __assign(__assign({}, todaysPlan.amelia.main), { slot: 'main' }),
                    __assign(__assign({}, todaysPlan.amelia.veggie), { slot: 'veggie' })
                ], false), todaysPlan.amelia.extras.map(function (item) { return (__assign(__assign({}, item), { slot: 'extra' })); }), true),
                hazel: __spreadArray(__spreadArray(__spreadArray([], todaysPlan.hazel.recess.map(function (item) { return (__assign(__assign({}, item), { slot: 'recess' })); }), true), [
                    __assign(__assign({}, todaysPlan.hazel.crunchAndSip), { slot: 'crunchAndSip' }),
                    __assign(__assign({}, todaysPlan.hazel.main), { slot: 'main' }),
                    __assign(__assign({}, todaysPlan.hazel.veggie), { slot: 'veggie' })
                ], false), todaysPlan.hazel.extras.map(function (item) { return (__assign(__assign({}, item), { slot: 'extra' })); }), true)
            };
            setLunchHistory(__spreadArray(__spreadArray([], lunchHistory, true), [historyEntry], false));
            setTodaysPlan(null);
        }
    };
    var StarRating = function (_a) {
        var rating = _a.rating, onChange = _a.onChange, label = _a.label, _b = _a.readOnly, readOnly = _b === void 0 ? false : _b;
        return (<div className="flex items-center gap-1">
        <span className="text-sm text-gray-600 w-16">{label}:</span>
        {[1, 2, 3, 4, 5].map(function (star) { return (<button key={star} type="button" onClick={function () { return !readOnly && onChange && onChange(star); }} className={"".concat(star <= rating ? 'text-yellow-400' : 'text-gray-300', " ").concat(!readOnly && onChange ? 'hover:text-yellow-300' : '')} disabled={readOnly}>
            <lucide_react_1.Star className="w-4 h-4 fill-current"/>
          </button>); })}
      </div>);
    };
    var PrepBadge = function (_a) {
        var prep = _a.prep;
        var colors = {
            none: 'bg-green-100 text-green-800',
            low: 'bg-yellow-100 text-yellow-800',
            medium: 'bg-orange-100 text-orange-800',
            high: 'bg-red-100 text-red-800'
        };
        return (<span className={"px-2 py-1 rounded-full text-xs font-medium ".concat(colors[prep])}>
        {prep} prep
      </span>);
    };
    var HealthBadge = function (_a) {
        var rating = _a.rating;
        var colors = {
            1: 'bg-red-100 text-red-800',
            2: 'bg-orange-100 text-orange-800',
            3: 'bg-yellow-100 text-yellow-800',
            4: 'bg-green-100 text-green-800',
            5: 'bg-emerald-100 text-emerald-800'
        };
        return (<span className={"px-2 py-1 rounded-full text-xs font-medium ".concat(colors[rating])}>
        Health: {rating}/5
      </span>);
    };
    var updateNewFoodTag = function (index, value) {
        var newTags = __spreadArray([], newFood.tags, true);
        newTags[index] = value;
        setNewFood(__assign(__assign({}, newFood), { tags: newTags }));
    };
    var addNewFoodTag = function () {
        setNewFood(__assign(__assign({}, newFood), { tags: __spreadArray(__spreadArray([], newFood.tags, true), [''], false) }));
    };
    var removeNewFoodTag = function (index) {
        var newTags = newFood.tags.filter(function (_, i) { return i !== index; });
        setNewFood(__assign(__assign({}, newFood), { tags: newTags }));
    };
    var FoodEditor = function (_a) {
        var food = _a.food, onSave = _a.onSave, onCancel = _a.onCancel;
        var _b = (0, react_1.useState)(food), editedFood = _b[0], setEditedFood = _b[1];
        return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Edit Food</h3>
            <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
              <lucide_react_1.X className="w-5 h-5"/>
            </button>
            {activeTab === 'tags' && (<div>
              <h2 className="text-xl font-semibold mb-6">Manage Tags</h2>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="font-medium mb-4">Add New Tag</h3>
                <div className="flex gap-2">
                  <input type="text" placeholder="Tag name (e.g. spicy, sweet, crunchy)" value={newTag} onChange={function (e) { return setNewTag(e.target.value); }} className="flex-1 p-2 border rounded-lg"/>
                  <button onClick={function () {
                    if (newTag.trim() && !availableTags.includes(newTag.trim().toLowerCase())) {
                        setAvailableTags(__spreadArray(__spreadArray([], availableTags, true), [newTag.trim().toLowerCase()], false));
                        setNewTag('');
                    }
                }} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    Add Tag
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Available Tags</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {availableTags.map(function (tag) { return (<div key={tag} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                      <span className="capitalize">{tag}</span>
                      <button onClick={function () {
                        setAvailableTags(availableTags.filter(function (t) { return t !== tag; }));
                        // Remove tag from all foods
                        setFoods(foods.map(function (f) { return (__assign(__assign({}, f), { tags: f.tags.filter(function (t) { return t !== tag; }) })); }));
                    }} className="text-red-500 hover:text-red-700 ml-2" title="Delete tag">
                        <lucide_react_1.X className="w-4 h-4"/>
                      </button>
                    </div>); })}
                </div>
              </div>
            </div>)}

          {activeTab === 'archived' && (<div>
              <h2 className="text-xl font-semibold mb-6">Out of Stock Foods</h2>
              {archivedFoods.length > 0 ? (<div className="space-y-6">
                  {['snack', 'fruit', 'main', 'veggie'].map(function (category) {
                        var categoryFoods = archivedFoods.filter(function (f) { return f.category === category; });
                        if (categoryFoods.length === 0)
                            return null;
                        return (<div key={category} className="border rounded-lg p-4 bg-gray-50">
                        <h3 className="font-medium mb-3 capitalize text-gray-600">
                          {category === 'snack' ? 'Snacks & Sides' : category} (Out of Stock)
                        </h3>
                        <div className="grid gap-3">
                          {categoryFoods.map(function (food) { return (<div key={food.id} className="bg-white p-3 rounded-lg border border-gray-200">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium text-gray-700">{food.name}</h4>
                                <div className="flex gap-2">
                                  <button onClick={function () { return restoreFood(food.id); }} className="text-green-500 hover:text-green-700" title="Mark as back in stock">
                                    <lucide_react_1.RotateCcw className="w-4 h-4"/>
                                  </button>
                                  <button onClick={function () { return deleteFood(food.id, true); }} className="text-red-500 hover:text-red-700" title="Delete permanently">
                                    <lucide_react_1.Trash2 className="w-4 h-4"/>
                                  </button>
                                </div>
                              </div>
                              <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <StarRating rating={food.ameliaRating} label="Amelia" readOnly/>
                                  <StarRating rating={food.hazelRating} label="Hazel" readOnly/>
                                  <StarRating rating={food.healthRating} label="Health" readOnly/>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex flex-wrap gap-1">
                                    <PrepBadge prep={food.prep}/>
                                    <HealthBadge rating={food.healthRating}/>
                                  </div>
                                  <TagBadges tags={food.tags}/>
                                </div>
                              </div>
                            </div>); })}
                        </div>
                      </div>);
                    })}
                </div>) : (<div className="text-center py-12">
                  <lucide_react_1.Archive className="w-16 h-16 mx-auto text-gray-300 mb-4"/>
                  <p className="text-gray-500">No foods are currently out of stock</p>
                </div>)}
            </div>)}

        </div>

          <div className="space-y-4">
            <input type="text" value={editedFood.name} onChange={function (e) { return setEditedFood(__assign(__assign({}, editedFood), { name: e.target.value })); }} className="w-full p-2 border rounded-lg" placeholder="Food name"/>

            <div className="grid grid-cols-2 gap-4">
              <select value={editedFood.category} onChange={function (e) { return setEditedFood(__assign(__assign({}, editedFood), { category: e.target.value })); }} className="p-2 border rounded-lg">
                <option value="snack">Snack/Side</option>
                <option value="fruit">Fruit</option>
                <option value="main">Main</option>
                <option value="veggie">Veggie</option>
              </select>

              <select value={editedFood.prep} onChange={function (e) { return setEditedFood(__assign(__assign({}, editedFood), { prep: e.target.value })); }} className="p-2 border rounded-lg">
                <option value="none">No prep</option>
                <option value="low">Low prep</option>
                <option value="medium">Medium prep</option>
                <option value="high">High prep</option>
              </select>
            </div>

            <div className="space-y-2">
              <StarRating rating={editedFood.ameliaRating} onChange={function (rating) { return setEditedFood(__assign(__assign({}, editedFood), { ameliaRating: rating })); }} label="Amelia"/>
              <StarRating rating={editedFood.hazelRating} onChange={function (rating) { return setEditedFood(__assign(__assign({}, editedFood), { hazelRating: rating })); }} label="Hazel"/>
              <StarRating rating={editedFood.healthRating} onChange={function (rating) { return setEditedFood(__assign(__assign({}, editedFood), { healthRating: rating })); }} label="Health"/>
            </div>

            <div className="flex gap-2 pt-4">
              <button onClick={function () { return onSave(editedFood); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Save Changes
              </button>
              <button onClick={onCancel} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>);
    };
    return (<div className="max-w-7xl mx-auto p-4 bg-gray-50 min-h-screen">
      {/* Confirmation Dialog */}
      {confirmDelete && (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to permanently delete this food? This cannot be undone.
            </p>
            <div className="flex gap-2">
              <button onClick={confirmDeleteAction} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
                Delete
              </button>
              <button onClick={function () { return setConfirmDelete(null); }} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400">
                Cancel
              </button>
            </div>
          </div>
        </div>)}

      {/* Food Editor */}
      {editingFood && (<FoodEditor food={editingFood} onSave={updateFood} onCancel={function () { return setEditingFood(null); }}/>)}
      <div className="bg-white rounded-lg shadow-sm border mb-6">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Lunchbox Manager</h1>
          <p className="text-gray-600">ADHD-friendly lunch planning for Amelia & Hazel</p>
        </div>

        <div className="flex border-b overflow-x-auto">
          <button onClick={function () { return setActiveTab('plan'); }} className={"px-6 py-3 font-medium whitespace-nowrap ".concat(activeTab === 'plan' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500')}>
            <lucide_react_1.Calendar className="w-4 h-4 inline mr-2"/>
            Today's Plan
          </button>
          <button onClick={function () { return setActiveTab('history'); }} className={"px-6 py-3 font-medium whitespace-nowrap ".concat(activeTab === 'history' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500')}>
            <lucide_react_1.Clock className="w-4 h-4 inline mr-2"/>
            History
          </button>
          <button onClick={function () { return setActiveTab('foods'); }} className={"px-6 py-3 font-medium whitespace-nowrap ".concat(activeTab === 'foods' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500')}>
            <lucide_react_1.Plus className="w-4 h-4 inline mr-2"/>
            Manage Foods
          </button>
          <button onClick={function () { return setActiveTab('tags'); }} className={"px-6 py-3 font-medium whitespace-nowrap ".concat(activeTab === 'tags' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500')}>
            Manage Tags
          </button>
          <button onClick={function () { return setActiveTab('archived'); }} className={"px-6 py-3 font-medium whitespace-nowrap ".concat(activeTab === 'archived' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500')}>
            <lucide_react_1.Archive className="w-4 h-4 inline mr-2"/>
            Out of Stock ({archivedFoods.length})
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'plan' && (<div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Lunchbox Plan</h2>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Plan for:</label>
                    <select value={planDate} onChange={function (e) { return setPlanDate(e.target.value); }} className="border rounded px-2 py-1 text-sm">
                      <option value="today">Today</option>
                      <option value="tomorrow">Tomorrow</option>
                    </select>
                  </div>
                  <button onClick={generateRecommendations} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                    <lucide_react_1.RefreshCw className="w-4 h-4"/>
                    Generate Plan
                  </button>
                </div>
              </div>

              {todaysPlan ? (<div className="space-y-6">
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
                            <lucide_react_1.Clock className="w-4 h-4"/>
                            Recess (10 min)
                          </h4>
                          <button onClick={function () { return swapItem('amelia', 'mixed', 'recess'); }} className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1">
                            <lucide_react_1.Shuffle className="w-3 h-3"/>
                            Swap
                          </button>
                        </div>
                        <div className="space-y-2">
                          {todaysPlan.amelia.recess.map(function (item, idx) { return (<div key={idx} className="bg-white p-3 rounded border-l-2 border-blue-400">
                              <div className="font-medium">{item.name}</div>
                              <div className="flex items-center gap-2 mt-1">
                                <StarRating rating={item.ameliaRating} label="Rating" readOnly/>
                              </div>
                              <div className="flex flex-wrap gap-1 mt-2">
                                <PrepBadge prep={item.prep}/>
                                <HealthBadge rating={item.healthRating}/>
                                {isRunningLow(item) && (<span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800 flex items-center gap-1">
                                    <lucide_react_1.AlertTriangle className="w-3 h-3"/>
                                    Low stock
                                  </span>)}
                              </div>
                              <TagBadges tags={item.tags}/>
                            </div>); })}
                        </div>
                      </div>

                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-semibold text-yellow-900">Crunch & Sip</h4>
                          <button onClick={function () { return swapItem('amelia', 'fruit', 'crunchAndSip'); }} className="text-yellow-600 hover:text-yellow-800 text-sm flex items-center gap-1">
                            <lucide_react_1.Shuffle className="w-3 h-3"/>
                            Swap
                          </button>
                        </div>
                        <div className="bg-white p-3 rounded border-l-2 border-yellow-400">
                          <div className="font-medium">{todaysPlan.amelia.crunchAndSip.name}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <StarRating rating={todaysPlan.amelia.crunchAndSip.ameliaRating} label="Rating" readOnly/>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            <PrepBadge prep={todaysPlan.amelia.crunchAndSip.prep}/>
                            <HealthBadge rating={todaysPlan.amelia.crunchAndSip.healthRating}/>
                          </div>
                          <TagBadges tags={todaysPlan.amelia.crunchAndSip.tags}/>
                        </div>
                      </div>

                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                          <lucide_react_1.Clock className="w-4 h-4"/>
                          Lunch (10 min eating)
                        </h4>
                        <div className="space-y-2">
                          <div className="bg-white p-3 rounded border-l-4 border-green-500">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="text-xs font-medium text-green-700 uppercase">Main</div>
                                <div className="font-medium">{todaysPlan.amelia.main.name}</div>
                                <div className="flex items-center gap-2 mt-1">
                                  <StarRating rating={todaysPlan.amelia.main.ameliaRating} label="Rating" readOnly/>
                                </div>
                                <div className="flex flex-wrap gap-1 mt-2">
                                  <PrepBadge prep={todaysPlan.amelia.main.prep}/>
                                  <HealthBadge rating={todaysPlan.amelia.main.healthRating}/>
                                </div>
                                <TagBadges tags={todaysPlan.amelia.main.tags}/>
                              </div>
                              <button onClick={function () { return swapItem('amelia', 'main', 'main'); }} className="text-green-600 hover:text-green-800 text-sm flex items-center gap-1 ml-2">
                                <lucide_react_1.Shuffle className="w-3 h-3"/>
                              </button>
                            </div>
                          </div>
                          
                          <div className="bg-white p-3 rounded border-l-2 border-green-300">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="text-xs font-medium text-green-700 uppercase">Veggie</div>
                                <div className="font-medium">{todaysPlan.amelia.veggie.name}</div>
                                <div className="flex items-center gap-2 mt-1">
                                  <StarRating rating={todaysPlan.amelia.veggie.ameliaRating} label="Rating" readOnly/>
                                </div>
                                <div className="flex flex-wrap gap-1 mt-2">
                                  <PrepBadge prep={todaysPlan.amelia.veggie.prep}/>
                                  <HealthBadge rating={todaysPlan.amelia.veggie.healthRating}/>
                                </div>
                                <TagBadges tags={todaysPlan.amelia.veggie.tags}/>
                              </div>
                              <button onClick={function () { return swapItem('amelia', 'veggie', 'veggie'); }} className="text-green-600 hover:text-green-800 text-sm flex items-center gap-1 ml-2">
                                <lucide_react_1.Shuffle className="w-3 h-3"/>
                              </button>
                            </div>
                          </div>

                          {todaysPlan.amelia.extras.map(function (item, idx) { return (<div key={idx} className="bg-white p-3 rounded border-l-2 border-gray-300">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <div className="text-xs font-medium text-gray-700 uppercase">Extra</div>
                                  <div className="font-medium">{item.name}</div>
                                  <div className="flex items-center gap-2 mt-1">
                                    <StarRating rating={item.ameliaRating} label="Rating" readOnly/>
                                  </div>
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    <PrepBadge prep={item.prep}/>
                                    <HealthBadge rating={item.healthRating}/>
                                  </div>
                                  <TagBadges tags={item.tags}/>
                                </div>
                                <button onClick={function () { return swapItem('amelia', 'mixed', 'extras'); }} className="text-gray-600 hover:text-gray-800 text-sm flex items-center gap-1 ml-2">
                                  <lucide_react_1.Shuffle className="w-3 h-3"/>
                                </button>
                              </div>
                            </div>); })}
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
                            <lucide_react_1.Clock className="w-4 h-4"/>
                            Recess (10 min)
                          </h4>
                          <button onClick={function () { return swapItem('hazel', 'mixed', 'recess'); }} className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1">
                            <lucide_react_1.Shuffle className="w-3 h-3"/>
                            Swap
                          </button>
                        </div>
                        <div className="space-y-2">
                          {todaysPlan.hazel.recess.map(function (item, idx) { return (<div key={idx} className="bg-white p-3 rounded border-l-2 border-blue-400">
                              <div className="font-medium">{item.name}</div>
                              <div className="flex items-center gap-2 mt-1">
                                <StarRating rating={item.hazelRating} label="Rating" readOnly/>
                              </div>
                              <div className="flex flex-wrap gap-1 mt-2">
                                <PrepBadge prep={item.prep}/>
                                <HealthBadge rating={item.healthRating}/>
                                {isRunningLow(item) && (<span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800 flex items-center gap-1">
                                    <lucide_react_1.AlertTriangle className="w-3 h-3"/>
                                    Low stock
                                  </span>)}
                              </div>
                              <TagBadges tags={item.tags}/>
                            </div>); })}
                        </div>
                      </div>

                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-semibold text-yellow-900">Crunch & Sip</h4>
                          <button onClick={function () { return swapItem('hazel', 'fruit', 'crunchAndSip'); }} className="text-yellow-600 hover:text-yellow-800 text-sm flex items-center gap-1">
                            <lucide_react_1.Shuffle className="w-3 h-3"/>
                            Swap
                          </button>
                        </div>
                        <div className="bg-white p-3 rounded border-l-2 border-yellow-400">
                          <div className="font-medium">{todaysPlan.hazel.crunchAndSip.name}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <StarRating rating={todaysPlan.hazel.crunchAndSip.hazelRating} label="Rating" readOnly/>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            <PrepBadge prep={todaysPlan.hazel.crunchAndSip.prep}/>
                            <HealthBadge rating={todaysPlan.hazel.crunchAndSip.healthRating}/>
                          </div>
                          <TagBadges tags={todaysPlan.hazel.crunchAndSip.tags}/>
                        </div>
                      </div>

                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                          <lucide_react_1.Clock className="w-4 h-4"/>
                          Lunch (10 min eating)
                        </h4>
                        <div className="space-y-2">
                          <div className="bg-white p-3 rounded border-l-4 border-green-500">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="text-xs font-medium text-green-700 uppercase">Main</div>
                                <div className="font-medium">{todaysPlan.hazel.main.name}</div>
                                <div className="flex items-center gap-2 mt-1">
                                  <StarRating rating={todaysPlan.hazel.main.hazelRating} label="Rating" readOnly/>
                                </div>
                                <div className="flex flex-wrap gap-1 mt-2">
                                  <PrepBadge prep={todaysPlan.hazel.main.prep}/>
                                  <HealthBadge rating={todaysPlan.hazel.main.healthRating}/>
                                </div>
                                <TagBadges tags={todaysPlan.hazel.main.tags}/>
                              </div>
                              <button onClick={function () { return swapItem('hazel', 'main', 'main'); }} className="text-green-600 hover:text-green-800 text-sm flex items-center gap-1 ml-2">
                                <lucide_react_1.Shuffle className="w-3 h-3"/>
                              </button>
                            </div>
                          </div>
                          
                          <div className="bg-white p-3 rounded border-l-2 border-green-300">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="text-xs font-medium text-green-700 uppercase">Veggie</div>
                                <div className="font-medium">{todaysPlan.hazel.veggie.name}</div>
                                <div className="flex items-center gap-2 mt-1">
                                  <StarRating rating={todaysPlan.hazel.veggie.hazelRating} label="Rating" readOnly/>
                                </div>
                                <div className="flex flex-wrap gap-1 mt-2">
                                  <PrepBadge prep={todaysPlan.hazel.veggie.prep}/>
                                  <HealthBadge rating={todaysPlan.hazel.veggie.healthRating}/>
                                </div>
                                <TagBadges tags={todaysPlan.hazel.veggie.tags}/>
                              </div>
                              <button onClick={function () { return swapItem('hazel', 'veggie', 'veggie'); }} className="text-green-600 hover:text-green-800 text-sm flex items-center gap-1 ml-2">
                                <lucide_react_1.Shuffle className="w-3 h-3"/>
                              </button>
                            </div>
                          </div>

                          {todaysPlan.hazel.extras.map(function (item, idx) { return (<div key={idx} className="bg-white p-3 rounded border-l-2 border-gray-300">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <div className="text-xs font-medium text-gray-700 uppercase">Extra</div>
                                  <div className="font-medium">{item.name}</div>
                                  <div className="flex items-center gap-2 mt-1">
                                    <StarRating rating={item.hazelRating} label="Rating" readOnly/>
                                  </div>
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    <PrepBadge prep={item.prep}/>
                                    <HealthBadge rating={item.healthRating}/>
                                  </div>
                                  <TagBadges tags={item.tags}/>
                                </div>
                                <button onClick={function () { return swapItem('hazel', 'mixed', 'extras'); }} className="text-gray-600 hover:text-gray-800 text-sm flex items-center gap-1 ml-2">
                                  <lucide_react_1.Shuffle className="w-3 h-3"/>
                                </button>
                              </div>
                            </div>); })}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <button onClick={confirmPlan} className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center gap-2 text-lg">
                      <lucide_react_1.CheckCircle className="w-5 h-5"/>
                      Pack These Lunches!
                    </button>
                  </div>
                </div>) : (<div className="text-center py-12">
                  <lucide_react_1.Clock className="w-16 h-16 mx-auto text-gray-300 mb-4"/>
                  <h3 className="text-lg font-medium text-gray-600 mb-2">No plan yet</h3>
                  <p className="text-gray-500">Select a date and click "Generate Plan" to get recommendations</p>
                </div>)}
            </div>)}

          {activeTab === 'history' && (<div>
              <h2 className="text-xl font-semibold mb-6">Lunch History</h2>
              {lunchHistory.length > 0 ? (<div className="space-y-6">
                  {lunchHistory.slice(-14).reverse().map(function (day, idx) { return (<div key={idx} className="border rounded-lg p-4 bg-white">
                      <h3 className="font-medium mb-4 text-center text-lg text-gray-700">{day.date}</h3>
                      <div className="grid lg:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium text-purple-600 mb-3">Amelia's Lunch</h4>
                          <div className="space-y-2 text-sm">
                            {day.amelia.map(function (item, i) { return (<div key={i} className="bg-gray-50 p-2 rounded">
                                <span className="font-medium text-xs text-gray-600 uppercase">{item.slot}</span>
                                <div>{item.name}</div>
                              </div>); })}    
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-pink-600 mb-3">Hazel's Lunch</h4>
                          <div className="space-y-2 text-sm">
                            {day.hazel.map(function (item, i) { return (<div key={i} className="bg-gray-50 p-2 rounded">
                                <span className="font-medium text-xs text-gray-600 uppercase">{item.slot}</span>
                                <div>{item.name}</div>
                              </div>); })}
                          </div>
                        </div>
                      </div>
                    </div>); })}
                </div>) : (<div className="text-center py-12">
                  <lucide_react_1.Calendar className="w-16 h-16 mx-auto text-gray-300 mb-4"/>
                  <p className="text-gray-500">No lunch history yet. Pack your first lunch!</p>
                </div>)}
            </div>)}

          {activeTab === 'foods' && (<div>
              <h2 className="text-xl font-semibold mb-6">Manage Food Options</h2>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="font-medium mb-4">Add New Food</h3>
                <div className="space-y-4">
                  <input type="text" placeholder="Food name" value={newFood.name} onChange={function (e) { return setNewFood(__assign(__assign({}, newFood), { name: e.target.value })); }} className="w-full p-2 border rounded-lg"/>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <select value={newFood.category} onChange={function (e) { return setNewFood(__assign(__assign({}, newFood), { category: e.target.value })); }} className="p-2 border rounded-lg">
                      <option value="snack">Snack/Side</option>
                      <option value="fruit">Fruit</option>
                      <option value="main">Main</option>
                      <option value="veggie">Veggie</option>
                    </select>
                    
                    <select value={newFood.prep} onChange={function (e) { return setNewFood(__assign(__assign({}, newFood), { prep: e.target.value })); }} className="p-2 border rounded-lg">
                      <option value="none">No prep</option>
                      <option value="low">Low prep</option>
                      <option value="medium">Medium prep</option>
                      <option value="high">High prep</option>
                    </select>
                  </div>

                  <input type="number" placeholder="Servings (optional - leave empty for unlimited)" value={newFood.servings || ''} onChange={function (e) { return setNewFood(__assign(__assign({}, newFood), { servings: e.target.value ? parseInt(e.target.value) : null })); }} className="w-full p-2 border rounded-lg text-sm" min="0"/>

                  <div className="space-y-2">
                    <StarRating rating={newFood.ameliaRating} onChange={function (rating) { return setNewFood(__assign(__assign({}, newFood), { ameliaRating: rating })); }} label="Amelia"/>
                    <StarRating rating={newFood.hazelRating} onChange={function (rating) { return setNewFood(__assign(__assign({}, newFood), { hazelRating: rating })); }} label="Hazel"/>
                    <StarRating rating={newFood.healthRating} onChange={function (rating) { return setNewFood(__assign(__assign({}, newFood), { healthRating: rating })); }} label="Health"/>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Tags (for variety)</label>
                    {newFood.tags.map(function (tag, idx) { return (<div key={idx} className="flex gap-2 mb-2">
                        <select value={tag} onChange={function (e) { return updateNewFoodTag(idx, e.target.value); }} className="flex-1 p-2 border rounded-lg">
                          <option value="">Select tag</option>
                          {availableTags.map(function (availableTag) { return (<option key={availableTag} value={availableTag}>{availableTag}</option>); })}
                        </select>
                        <button onClick={function () { return removeNewFoodTag(idx); }} className="text-red-500 hover:text-red-700" type="button">
                          <lucide_react_1.Trash2 className="w-4 h-4"/>
                        </button>
                      </div>); })}
                    <button onClick={addNewFoodTag} className="text-blue-600 hover:text-blue-800 text-sm" type="button">
                      + Add tag
                    </button>
                  </div>
                </div>
                
                <button onClick={addFood} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  Add Food
                </button>
              </div>

              <div className="space-y-6">
                {['snack', 'fruit', 'main', 'veggie'].map(function (category) { return (<div key={category} className="border rounded-lg p-4">
                    <h3 className="font-medium mb-3 capitalize">
                      {category === 'snack' ? 'Snacks & Sides' : category} Options
                    </h3>
                    <div className="grid gap-3">
                      {foods.filter(function (f) { return f.category === category; }).map(function (food) { return (<div key={food.id} className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium flex items-center gap-2">
                              {food.name}
                              {isRunningLow(food) && (<span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800 flex items-center gap-1">
                                  <lucide_react_1.AlertTriangle className="w-3 h-3"/>
                                  Low stock
                                </span>)}
                              {food.servings !== null && food.servings !== undefined && (<span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                                  {food.servings} servings
                                </span>)}
                            </h4>
                            <div className="flex gap-2">
                              <button onClick={function () { return setEditingFood(food); }} className="text-blue-500 hover:text-blue-700" title="Edit food">
                                <lucide_react_1.Edit className="w-4 h-4"/>
                              </button>
                              <button onClick={function () { return archiveFood(food.id); }} className="text-orange-500 hover:text-orange-700" title="Mark as out of stock">
                                <lucide_react_1.Archive className="w-4 h-4"/>
                              </button>
                              <button onClick={function () { return deleteFood(food.id); }} className="text-red-500 hover:text-red-700" title="Delete permanently">
                                <lucide_react_1.Trash2 className="w-4 h-4"/>
                              </button>
                            </div>
                          </div>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <StarRating rating={food.ameliaRating} label="Amelia" readOnly/>
                              <StarRating rating={food.hazelRating} label="Hazel" readOnly/>
                              <StarRating rating={food.healthRating} label="Health" readOnly/>
                            </div>
                            <div className="space-y-2">
                              <div className="flex flex-wrap gap-1">
                                <PrepBadge prep={food.prep}/>
                                <HealthBadge rating={food.healthRating}/>
                              </div>
                              <TagBadges tags={food.tags}/>
                            </div>
                          </div>
                        </div>); })}
                    </div>
                  </div>); })}
              </div>
            </div>)}
        </div>
      </div>
    </div>);
};
exports.default = LunchboxManager;

import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  StatusBar,
  ScrollView,
} from 'react-native';

// --- TYPES ---
export type CourseType = 'Starter' | 'Main' | 'Dessert';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  course: CourseType;
  imageUri: string;
}

// --- SAMPLE INITIAL DATA ---
const INITIAL_MENU: MenuItem[] = [
  {
    id: '1',
    name: 'Caesar Salad',
    description: 'Crisp romaine lettuce, croutons, and parmesan cheese.',
    price: 8.5,
    course: 'Starter',
    imageUri: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=200&auto=format&fit=crop&q=60',
  },
  {
    id: '2',
    name: 'Grilled Salmon',
    description: 'Fresh salmon served with seasonal roasted vegetables.',
    price: 18.0,
    course: 'Main',
    imageUri: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=200&auto=format&fit=crop&q=60',
  },
  {
    id: '3',
    name: 'Chocolate Mousse',
    description: 'Rich, velvety chocolate mousse with fresh berries.',
    price: 6.5,
    course: 'Dessert',
    imageUri: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=200&auto=format&fit=crop&q=60',
  },
];

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'splash' | 'add' | 'list'>('splash');
  const [activeTab, setActiveTab] = useState<'menu' | 'order' | 'settings'>('menu');
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU);

  // Form State
  const [dishName, setDishName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<CourseType>('Starter');

  // --- SPLASH SCREEN TIMER (3 SECONDS) ---
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentScreen('list');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Handle Adding New Menu Item
  const handleSaveItem = () => {
    if (!dishName.trim() || !price.trim()) return;

    const newItem: MenuItem = {
      id: Date.now().toString(),
      name: dishName,
      description: description,
      price: parseFloat(price) || 0,
      course: selectedCourse,
      imageUri: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&auto=format&fit=crop&q=60',
    };

    setMenuItems([newItem, ...menuItems]);
    
    // Clear form and return to menu list
    setDishName('');
    setDescription('');
    setPrice('');
    setSelectedCourse('Starter');
    setCurrentScreen('list');
  };

  // Handle Item Deletion
  const handleDeleteItem = (id: string) => {
    setMenuItems((prev: MenuItem[]) => prev.filter((item: MenuItem) => item.id !== id));
  };

  // --- SCREEN 1: SPLASH SCREEN ---
  if (currentScreen === 'splash') {
    return (
      <SafeAreaView style={styles.splashContainer}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.splashContent}>
          <Text style={styles.splashTitle}>CHRISTOFFEL'S{'\n'}KITCHEN</Text>
          <Text style={styles.splashSubtitle}>Your culinary assistant.</Text>
        </View>
      </SafeAreaView>
    );
  }

  // --- SCREEN 2: ADD MENU ITEM ---
  if (currentScreen === 'add') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setCurrentScreen('list')} style={styles.backButton}>
            <Text style={styles.backButtonText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Christoffel's Kitchen</Text>
        </View>

        <ScrollView contentContainerStyle={styles.formContainer}>
          <Text style={styles.formSectionTitle}>ADD MENU ITEM</Text>

          <Text style={styles.label}>Dish Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter dish name"
            placeholderTextColor="#A0A0A0"
            value={dishName}
            onChangeText={setDishName}
          />

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter description..."
            placeholderTextColor="#A0A0A0"
            multiline
            numberOfLines={4}
            value={description}
            onChangeText={setDescription}
          />

          <Text style={styles.label}>Price</Text>
          <TextInput
            style={styles.input}
            placeholder="[$ 0.00]"
            placeholderTextColor="#A0A0A0"
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
          />

          <Text style={styles.label}>Course</Text>
          <View style={styles.courseDropdown}>
            <Text style={styles.dropdownText}>Select Course</Text>
            <Text style={styles.dropdownArrow}>▼</Text>
          </View>

          {/* Course Selector Buttons */}
          <View style={styles.courseSelector}>
            {(['Starter', 'Main', 'Dessert'] as CourseType[]).map((course) => (
              <TouchableOpacity
                key={course}
                style={[
                  styles.courseChip,
                  selectedCourse === course && styles.courseChipActive,
                ]}
                onPress={() => setSelectedCourse(course)}
              >
                <Text
                  style={[
                    styles.courseChipText,
                    selectedCourse === course && styles.courseChipTextActive,
                  ]}
                >
                  {course}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Save Button */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveItem}>
            <Text style={styles.saveButtonText}>SAVE</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // --- SCREEN 3: MENU LIST ---
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {/* Header */}
      <View style={styles.listHeader}>
        <Text style={styles.listHeaderTitle}>Menu List</Text>
        <TouchableOpacity style={styles.addItemBtn} onPress={() => setCurrentScreen('add')}>
          <Text style={styles.addItemBtnText}>+ Add Item</Text>
        </TouchableOpacity>
      </View>

      {/* Menu List */}
      <FlatList
        data={menuItems}
        keyExtractor={(item: MenuItem) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }: { item: MenuItem }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.imageUri }} style={styles.cardImage} />
            <View style={styles.cardDetails}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardCourse}>
                Course: {item.course} {item.price ? `• $${item.price.toFixed(2)}` : ''}
              </Text>
            </View>
            <View style={styles.cardActions}>
              <TouchableOpacity style={styles.actionIconButton}>
                <Text style={styles.actionIcon}>✎</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionIconButton}
                onPress={() => handleDeleteItem(item.id)}
              >
                <Text style={[styles.actionIcon, styles.deleteIcon]}>🗑</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Bottom Navigation */}
      <View style={styles.bottomTab}>
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('menu')}>
          <Text style={[styles.tabIcon, activeTab === 'menu' && styles.tabIconActive]}>🏠</Text>
          <Text style={[styles.tabLabel, activeTab === 'menu' && styles.tabLabelActive]}>MENU</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('order')}>
          <Text style={[styles.tabIcon, activeTab === 'order' && styles.tabIconActive]}>📋</Text>
          <Text style={[styles.tabLabel, activeTab === 'order' && styles.tabLabelActive]}>ORDER</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('settings')}>
          <Text style={[styles.tabIcon, activeTab === 'settings' && styles.tabIconActive]}>⚙</Text>
          <Text style={[styles.tabLabel, activeTab === 'settings' && styles.tabLabelActive]}>SETTINGS</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F0',
  },
  
  // Splash Screen Styles
  splashContainer: {
    flex: 1,
    backgroundColor: '#EFEBE4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashContent: {
    alignItems: 'center',
  },
  splashTitle: {
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: 2,
    textAlign: 'center',
    color: '#333333',
    lineHeight: 34,
  },
  splashSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginTop: 12,
    fontStyle: 'italic',
  },

  // Header Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    paddingRight: 12,
  },
  backButtonText: {
    fontSize: 28,
    color: '#333',
    lineHeight: 28,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },

  // Add Item Screen Styles
  formContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  formSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    marginVertical: 16,
    color: '#222',
    letterSpacing: 0.5,
  },
  label: {
    fontSize: 13,
    color: '#555',
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D3D3D3',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
  },
  textArea: {
    height: 90,
    textAlignVertical: 'top',
  },
  courseDropdown: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D3D3D3',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 14,
    color: '#888',
  },
  dropdownArrow: {
    fontSize: 10,
    color: '#666',
  },
  courseSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 12,
    gap: 8,
  },
  courseChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#CCC',
  },
  courseChipActive: {
    backgroundColor: '#2E5A52',
    borderColor: '#2E5A52',
  },
  courseChipText: {
    fontSize: 12,
    color: '#555',
  },
  courseChipTextActive: {
    color: '#FFF',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#2E5A52',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 1,
  },

  // Menu List Styles
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    position: 'relative',
  },
  listHeaderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  addItemBtn: {
    position: 'absolute',
    right: 20,
  },
  addItemBtnText: {
    fontSize: 14,
    color: '#555',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  cardImage: {
    width: 54,
    height: 54,
    borderRadius: 8,
  },
  cardDetails: {
    flex: 1,
    marginLeft: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
  },
  cardCourse: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIconButton: {
    padding: 6,
  },
  actionIcon: {
    fontSize: 16,
    color: '#555',
  },
  deleteIcon: {
    color: '#A94442',
    marginLeft: 4,
  },

  // Bottom Navigation Styles
  bottomTab: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
  },
  tabIcon: {
    fontSize: 18,
    color: '#888',
  },
  tabIconActive: {
    color: '#2E5A52',
  },
  tabLabel: {
    fontSize: 10,
    color: '#888',
    marginTop: 2,
  },
  tabLabelActive: {
    color: '#2E5A52',
    fontWeight: '700',
  },
});
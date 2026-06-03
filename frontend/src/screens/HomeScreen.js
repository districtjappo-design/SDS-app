import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Button, Card } from 'react-native-paper';

export default function HomeScreen({ navigation }) {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Bienvenue dans Scout App</Text>
      <Text style={styles.subtitle}>Gestion administrative et pédagogique du scoutisme</Text>
      
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>Module Exécutif</Text>
          <Text style={styles.cardDescription}>Procédures administratives et financières</Text>
        </Card.Content>
        <Card.Actions>
          <Button onPress={() => navigation.navigate('Exécutif')}>Accéder</Button>
        </Card.Actions>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>Documents Pédagogiques</Text>
          <Text style={styles.cardDescription}>Ressources par branche et activités</Text>
        </Card.Content>
        <Card.Actions>
          <Button onPress={() => navigation.navigate('Documents')}>Accéder</Button>
        </Card.Actions>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>Chat</Text>
          <Text style={styles.cardDescription}>Communication de groupe et messages directs</Text>
        </Card.Content>
        <Card.Actions>
          <Button onPress={() => navigation.navigate('Chat')}>Accéder</Button>
        </Card.Actions>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>Profil</Text>
          <Text style={styles.cardDescription}>Gestion de votre profil et préférences</Text>
        </Card.Content>
        <Card.Actions>
          <Button onPress={() => navigation.navigate('Profil')}>Accéder</Button>
        </Card.Actions>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16, 
    backgroundColor: '#f5f5f5' 
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 8,
    color: '#333'
  },
  subtitle: { 
    fontSize: 14, 
    color: '#666', 
    marginBottom: 16 
  },
  card: { 
    marginBottom: 12,
    borderRadius: 8,
    elevation: 3
  },
  cardTitle: { 
    fontSize: 16, 
    fontWeight: 'bold',
    color: '#333'
  },
  cardDescription: { 
    fontSize: 12, 
    color: '#666', 
    marginTop: 4 
  },
});

import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

interface ElderlyProfile {
  id: string;
  name: string;
  age: number;
  location: string;
  familyContact: string;
  lonelinessScore: number;
  mobility: string;
  appetite: string;
  notes: string;
}

const PROFILES_FILE = path.join(process.cwd(), 'backend', 'data', 'profiles.json');

const loadProfiles = (): ElderlyProfile[] => {
  try {
    if (!fs.existsSync(PROFILES_FILE)) {
      return [];
    }
    const data = fs.readFileSync(PROFILES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading profiles:', error);
    return [];
  }
};

const saveProfiles = (profiles: ElderlyProfile[]): void => {
  try {
    const dir = path.dirname(PROFILES_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(PROFILES_FILE, JSON.stringify(profiles, null, 2));
  } catch (error) {
    console.error('Error saving profiles:', error);
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { profile_id } = req.query;

  if (req.method === 'GET') {
    // Get all profiles or filter by familyContact
    const profiles = loadProfiles();
    const { familyContact } = req.query;

    if (familyContact && typeof familyContact === 'string') {
      const filtered = profiles.filter(profile =>
        profile.familyContact.trim().toLowerCase() === familyContact.trim().toLowerCase()
      );
      return res.status(200).json(filtered);
    }

    return res.status(200).json(profiles);

  } else if (req.method === 'POST') {
    // Create new profile
    try {
      const profileData = req.body;
      const profiles = loadProfiles();

      const newProfile: ElderlyProfile = {
        id: Date.now().toString(),
        name: profileData.name,
        age: parseInt(profileData.age),
        location: profileData.location,
        familyContact: profileData.familyContact,
        lonelinessScore: parseInt(profileData.lonelinessScore) || 0,
        mobility: profileData.mobility || 'Good',
        appetite: profileData.appetite || 'Good',
        notes: profileData.notes || ''
      };

      profiles.push(newProfile);
      saveProfiles(profiles);

      res.status(201).json(newProfile);
    } catch (error) {
      console.error('Error creating profile:', error);
      res.status(500).json({ error: 'Failed to create profile' });
    }

  } else if (req.method === 'PUT' && profile_id) {
    // Update existing profile
    try {
      const profileData = req.body;
      const profiles = loadProfiles();
      const profileIndex = profiles.findIndex(p => p.id === profile_id);

      if (profileIndex === -1) {
        return res.status(404).json({ error: 'Profile not found' });
      }

      const updatedProfile = {
        ...profiles[profileIndex],
        ...profileData,
        age: parseInt(profileData.age) || profiles[profileIndex].age,
        lonelinessScore: parseInt(profileData.lonelinessScore) || profiles[profileIndex].lonelinessScore
      };

      profiles[profileIndex] = updatedProfile;
      saveProfiles(profiles);

      res.status(200).json(updatedProfile);
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ error: 'Failed to update profile' });
    }

  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
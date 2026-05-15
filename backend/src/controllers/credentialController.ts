import { Request, Response } from 'express';
import Credential from '../models/Credential';

// @desc    Get all credentials
// @route   GET /api/credentials
// @access  Private
export const getCredentials = async (req: any, res: Response) => {
  try {
    const credentials = await Credential.find({ createdBy: req.user._id }).populate('project', 'title');
    res.json(credentials);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a credential
// @route   POST /api/credentials
// @access  Private
export const createCredential = async (req: any, res: Response) => {
  const { title, username, password, url, notes, project } = req.body;

  try {
    const credential = await Credential.create({
      title,
      username,
      password,
      url,
      notes,
      project: project || undefined,
      createdBy: req.user._id,
    });

    res.status(201).json(credential);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a credential
// @route   PUT /api/credentials/:id
// @access  Private
export const updateCredential = async (req: any, res: Response) => {
  try {
    const credential = await Credential.findById(req.params.id);

    if (!credential) {
      return res.status(404).json({ message: 'Credential not found' });
    }

    if (credential.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedCredential = await Credential.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedCredential);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a credential
// @route   DELETE /api/credentials/:id
// @access  Private
export const deleteCredential = async (req: any, res: Response) => {
  try {
    const credential = await Credential.findById(req.params.id);

    if (!credential) {
      return res.status(404).json({ message: 'Credential not found' });
    }

    if (credential.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await credential.deleteOne();
    res.json({ message: 'Credential removed' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

import { Response } from "express";
import { ExtendedRequest } from "../../types/types";
import prisma from "../../utility/prisma";

export const createNote = async (req: ExtendedRequest, res: Response) => {
  try {
    const { title, note, isComplete } = req.body as {
      title: string;
      note: string;
      isComplete?: boolean;
    };
    const newNote = await prisma.note.create({
      data: {
        title,
        note,
        isComplete,
        shopOwnerId: req.shopOwner.id,
      },
    });
    res.status(200).json(newNote);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getNotes = async (req: ExtendedRequest, res: Response) => {
  try {
    const notes = await prisma.note.findMany({
      where: {
        shopOwnerId: req.shopOwner.id,
      },
    });
    res.status(200).json(notes);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getSingleNote = async (req: ExtendedRequest, res: Response) => {
  try {
    const note = await prisma.note.findUnique({
      where: {
        id: req.params.id,
        shopOwnerId: req.shopOwner.id,
      },
    });
    res.status(200).json(note);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateNote = async (req: ExtendedRequest, res: Response) => {
  try {
    const { title, note, isComplete } = req.body as {
      title: string;
      note: string;
      isComplete?: boolean;
    };
    const updatedNote = await prisma.note.update({
      where: {
        id: req.params.id,
        shopOwnerId: req.shopOwner.id,
      },
      data: {
        title,
        note,
        isComplete,
      },
    });
    res.status(200).json(updatedNote);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteNote = async (req: ExtendedRequest, res: Response) => {
  try {
    const deletedNote = await prisma.note.delete({
      where: {
        id: req.params.id,
        shopOwnerId: req.shopOwner.id,
      },
    });
    res.status(200).json(deletedNote);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteMeanyNotesByGivenId = async (
  req: ExtendedRequest,
  res: Response
) => {
  const ids = req.body.ids as string[];
  try {
    const deletedNote = await prisma.note.deleteMany({
      where: {
        id: {
          in: ids,
        },
        shopOwnerId: req.shopOwner.id,
      },
    });
    res.status(200).json(deletedNote);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteAllNotes = async (req: ExtendedRequest, res: Response) => {
  try {
    const deletedNote = await prisma.note.deleteMany({
      where: {
        shopOwnerId: req.shopOwner.id,
      },
    });
    res.status(200).json(deletedNote);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCompletedNotes = async (
  req: ExtendedRequest,
  res: Response
) => {
  try {
    const notes = await prisma.note.findMany({
      where: {
        shopOwnerId: req.shopOwner.id,
        isComplete: true,
      },
    });
    res.status(200).json(notes);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUncompletedNotes = async (
  req: ExtendedRequest,
  res: Response
) => {
  try {
    const notes = await prisma.note.findMany({
      where: {
        shopOwnerId: req.shopOwner.id,
        isComplete: false,
      },
    });
    res.status(200).json(notes);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const completeInCompleteManyNotes = async (
  req: ExtendedRequest,
  res: Response
) => {
  const ids = req.body.ids as string[];
  try {
    const updatedNotes = await prisma.note.updateMany({
      where: {
        id: {
          in: ids,
        },
        shopOwnerId: req.shopOwner.id,
      },
      data: {
        isComplete: req.body.isComplete,
      },
    });
    res.status(200).json(updatedNotes);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

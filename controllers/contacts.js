const { Contact } = require('../models/contact');

const { HttpError, ctrlWrapper } = require('../helpers');

const getContacts = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 20, favorite } = req.query;
  const skip = (page - 1) * limit;

  if (favorite) {
    const result = await Contact.find(
      { owner, favorite },
      '-createdAt -updatedAt',
      {
        skip,
        limit,
      }
    ).populate('owner', 'name email');
    res.json(result);
  }

  const result = await Contact.find({ owner }, '-createdAt, -updatedAt', {
    skip,
    limit,
  }).populate('owner', 'name email');
  res.json(result);
};

const getContactById = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findById(id);

  if (!result) {
    throw HttpError(404, 'Not found');
  }
  res.status(200).json(result);
};

const addNewContact = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await Contact.create({ ...req.body, owner });
  res.status(201).json(result);
};

const updateContactById = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });

  if (!result) {
    throw HttpError(404, 'Not found');
  }
  res.status(200).json(result);
};

const deleteContact = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndRemove(id);
  if (!result) {
    throw HttpError(404, 'Not found');
  }
  res.status(200).json({
    message: 'Contact deleted',
    result,
  });
};

const updateFavorite = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });
  if (!result) {
    throw HttpError(404, 'Not found');
  }
  res.status(200).json(result);
};

module.exports = {
  getContacts: ctrlWrapper(getContacts),
  getContactById: ctrlWrapper(getContactById),
  addNewContact: ctrlWrapper(addNewContact),
  updateContactById: ctrlWrapper(updateContactById),
  deleteContact: ctrlWrapper(deleteContact),
  updateFavorite: ctrlWrapper(updateFavorite),
};

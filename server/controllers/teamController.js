const { validationResult } = require('express-validator');
const Team = require('../models/Team');
const generateInviteCode = require('../utils/generateInviteCode');

// @desc    Get all teams the current user owns or belongs to
// @route   GET /api/teams
// @access  Private
const getTeams = async (req, res, next) => {
  try {
    const teams = await Team.find({ members: req.user._id })
      .populate('owner', 'name email avatar')
      .populate('members', 'name email avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: { teams } });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new team
// @route   POST /api/teams
// @access  Private
const createTeam = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }

    const { name, description } = req.body;

    // Guarantee a unique invite code, retrying on the rare collision
    let inviteCode = generateInviteCode();
    let existingTeam = await Team.findOne({ inviteCode });
    while (existingTeam) {
      inviteCode = generateInviteCode();
      existingTeam = await Team.findOne({ inviteCode });
    }

    const team = await Team.create({
      name,
      description,
      owner: req.user._id,
      members: [req.user._id],
      inviteCode,
    });

    const populatedTeam = await Team.findById(team._id)
      .populate('owner', 'name email avatar')
      .populate('members', 'name email avatar');

    res.status(201).json({
      success: true,
      message: 'Team created successfully',
      data: { team: populatedTeam },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Join a team using an invite code
// @route   POST /api/teams/join
// @access  Private
const joinTeam = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }

    const { inviteCode } = req.body;

    const team = await Team.findOne({ inviteCode: inviteCode.trim().toUpperCase() });
    if (!team) {
      return res.status(404).json({ success: false, message: 'Invalid invite code' });
    }

    if (team.members.some((memberId) => memberId.toString() === req.user._id.toString())) {
      return res.status(400).json({ success: false, message: 'You are already a member of this team' });
    }

    team.members.push(req.user._id);
    await team.save();

    const populatedTeam = await Team.findById(team._id)
      .populate('owner', 'name email avatar')
      .populate('members', 'name email avatar');

    res.status(200).json({
      success: true,
      message: `You joined ${team.name}`,
      data: { team: populatedTeam },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single team by id
// @route   GET /api/teams/:id
// @access  Private
const getTeamById = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate('owner', 'name email avatar')
      .populate('members', 'name email avatar');

    if (!team) {
      return res.status(404).json({ success: false, message: 'Team not found' });
    }

    const isMember = team.members.some(
      (member) => member._id.toString() === req.user._id.toString()
    );
    if (!isMember) {
      return res.status(403).json({ success: false, message: 'You are not a member of this team' });
    }

    res.status(200).json({ success: true, data: { team } });
  } catch (error) {
    next(error);
  }
};

// @desc    Leave a team
// @route   DELETE /api/teams/:id/leave
// @access  Private
const leaveTeam = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ success: false, message: 'Team not found' });
    }

    if (team.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Team owners cannot leave their own team. Delete the team instead.',
      });
    }

    const isMember = team.members.some(
      (memberId) => memberId.toString() === req.user._id.toString()
    );
    if (!isMember) {
      return res.status(400).json({ success: false, message: 'You are not a member of this team' });
    }

    team.members = team.members.filter(
      (memberId) => memberId.toString() !== req.user._id.toString()
    );
    await team.save();

    res.status(200).json({ success: true, message: 'You left the team' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTeams, createTeam, joinTeam, getTeamById, leaveTeam };

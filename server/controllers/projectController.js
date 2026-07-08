const { validationResult } = require('express-validator');
const Project = require('../models/Project');
const Team = require('../models/Team');

// @desc    Get all projects for teams the user belongs to (optionally filtered by team)
// @route   GET /api/projects?team=<teamId>
// @access  Private
const getProjects = async (req, res, next) => {
  try {
    const { team } = req.query;

    // Only teams the current user is a member of
    const myTeams = await Team.find({ members: req.user._id }).select('_id');
    const myTeamIds = myTeams.map((t) => t._id.toString());

    let filter = { team: { $in: myTeamIds } };

    if (team) {
      if (!myTeamIds.includes(team)) {
        return res.status(403).json({ success: false, message: 'You are not a member of this team' });
      }
      filter = { team };
    }

    const projects = await Project.find(filter)
      .populate('team', 'name')
      .populate('createdBy', 'name email avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: { projects } });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new project under a team
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }

    const { name, description, team, startDate, endDate } = req.body;

    const teamDoc = await Team.findById(team);
    if (!teamDoc) {
      return res.status(404).json({ success: false, message: 'Team not found' });
    }

    const isMember = teamDoc.members.some(
      (memberId) => memberId.toString() === req.user._id.toString()
    );
    if (!isMember) {
      return res.status(403).json({ success: false, message: 'You are not a member of this team' });
    }

    const project = await Project.create({
      name,
      description,
      team,
      createdBy: req.user._id,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    });

    const populatedProject = await Project.findById(project._id)
      .populate('team', 'name')
      .populate('createdBy', 'name email avatar');

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: { project: populatedProject },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single project by id
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate({
        path: 'team',
        select: 'name members',
        populate: { path: 'members', select: 'name email avatar' },
      })
      .populate('createdBy', 'name email avatar');

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const isMember = project.team.members.some(
      (member) => member._id.toString() === req.user._id.toString()
    );
    if (!isMember) {
      return res.status(403).json({ success: false, message: 'You are not a member of this project\'s team' });
    }

    res.status(200).json({ success: true, data: { project } });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProjects, createProject, getProjectById };

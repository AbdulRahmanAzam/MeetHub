import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  Chip
} from '@mui/material';
import { TreeView, TreeItem } from '@mui/lab';
import {
  ExpandMore,
  ChevronRight,
  AccountTree
} from '@mui/icons-material';
import { departmentService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const loadDepartments = useCallback(async () => {
    if (!user.society) {
      setLoading(false);
      return;
    }
    
    try {
      const response = await departmentService.getBySociety(user.society);
      setDepartments(response.data);
    } catch (error) {
      toast.error('Failed to load departments');
    } finally {
      setLoading(false);
    }
  }, [user.society]);

  useEffect(() => {
    loadDepartments();
  }, [loadDepartments]);

  const buildDepartmentTree = (departments, parentId = null) => {
    return departments
      .filter(dept => {
        if (parentId === null) {
          return dept.parentDepartment === null || dept.parentDepartment === undefined;
        }
        return dept.parentDepartment?._id === parentId || dept.parentDepartment === parentId;
      })
      .map(dept => ({
        ...dept,
        children: buildDepartmentTree(departments, dept._id)
      }));
  };

  const renderTree = (nodes) => {
    return nodes.map((node) => (
      <TreeItem
        key={node._id}
        nodeId={node._id}
        label={
          <Box sx={{ display: 'flex', alignItems: 'center', py: 1 }}>
            <Typography variant="body1" sx={{ fontWeight: 'inherit', flexGrow: 1 }}>
              {node.name}
            </Typography>
            <Chip
              label={`Level ${node.level}`}
              size="small"
              color="primary"
              sx={{ mr: 1 }}
            />
            <Chip
              label={`${node.members?.length || 0} members`}
              size="small"
              variant="outlined"
            />
          </Box>
        }
      >
        {node.children && node.children.length > 0 && renderTree(node.children)}
      </TreeItem>
    ));
  };

  if (loading) {
    return <Container><Typography>Loading...</Typography></Container>;
  }

  if (!user.society) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <AccountTree sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            You need to join a society first
          </Typography>
          <Button variant="contained" sx={{ mt: 2 }} onClick={() => window.location.href = '/society/join'}>
            Join Society
          </Button>
        </Paper>
      </Container>
    );
  }

  const departmentTree = buildDepartmentTree(departments);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Department Hierarchy</Typography>
        {['president', 'vicepresident', 'excom', 'extended'].includes(user.role) && (
          <Button variant="contained" onClick={() => window.location.href = '/departments/create'}>
            Create Department
          </Button>
        )}
      </Box>

      {departments.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <AccountTree sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No departments created yet
          </Typography>
        </Paper>
      ) : (
        <Paper sx={{ p: 3 }}>
          <TreeView
            defaultCollapseIcon={<ExpandMore />}
            defaultExpandIcon={<ChevronRight />}
            sx={{ flexGrow: 1, overflowY: 'auto' }}
          >
            {renderTree(departmentTree)}
          </TreeView>
        </Paper>
      )}
    </Container>
  );
};

export default Departments;

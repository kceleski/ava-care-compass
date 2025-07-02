import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar, CheckCircle, Clock, ArrowRight, Users, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Assessment {
  current_mobility: string;
  cognitive_status: string;
  medical_conditions: string;
  support_system: string;
}

interface TimelineMilestone {
  id: string;
  name: string;
  description: string;
  estimated_timeframe: string;
  care_level_required: string;
  task_template: string;
}

interface PlanMilestone {
  id: string;
  milestone: TimelineMilestone;
  estimated_date: string;
  tasks: string[];
  completed: boolean;
}

const TimelinePlanner = () => {
  const [step, setStep] = useState(1);
  const [assessment, setAssessment] = useState<Assessment>({
    current_mobility: '',
    cognitive_status: '',
    medical_conditions: '',
    support_system: ''
  });
  const [timeline, setTimeline] = useState<PlanMilestone[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const submitAssessment = async () => {
    setLoading(true);
    
    try {
      // Create assessment
      const { data: assessmentData, error: assessmentError } = await supabase
        .from('care_needs_assessments')
        .insert([{
          ...assessment,
          user_id: 'anonymous' // In real app, this would be auth.uid()
        }])
        .select()
        .single();

      if (assessmentError) throw assessmentError;

      // Create timeline plan
      const { data: planData, error: planError } = await supabase
        .from('timeline_plans')
        .insert([{
          assessment_id: assessmentData.id,
          user_id: 'anonymous' // In real app, this would be auth.uid()
        }])
        .select()
        .single();

      if (planError) throw planError;

      // Generate milestones based on assessment
      await generateTimeline(planData.id, assessment);
      
      setStep(2);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create timeline. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateTimeline = async (planId: string, assessment: Assessment) => {
    try {
      // Get available milestone templates
      const { data: milestones, error } = await supabase
        .from('timeline_milestones')
        .select('*')
        .order('name');

      if (error) throw error;

      const selectedMilestones = [];
      const baseDate = new Date();

      // Always include family communication
      const familyComm = milestones.find(m => m.name === 'Family Communication');
      if (familyComm) {
        const nextMonth = new Date(baseDate);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        selectedMilestones.push({
          milestone_id: familyComm.id,
          estimated_date: nextMonth.toISOString().split('T')[0],
          tasks: familyComm.task_template
        });
      }

      // Add milestones based on assessment
      if (assessment.current_mobility === 'independent') {
        const homeSafety = milestones.find(m => m.name === 'Home Safety Assessment');
        if (homeSafety) {
          const nextMonth = new Date(baseDate);
          nextMonth.setMonth(nextMonth.getMonth() + 1);
          selectedMilestones.push({
            milestone_id: homeSafety.id,
            estimated_date: nextMonth.toISOString().split('T')[0],
            tasks: homeSafety.task_template
          });
        }
      }

      if (assessment.cognitive_status === 'normal' || assessment.cognitive_status === 'mild_decline') {
        const legalPlanning = milestones.find(m => m.name === 'Legal Planning');
        if (legalPlanning) {
          const twoMonths = new Date(baseDate);
          twoMonths.setMonth(twoMonths.getMonth() + 2);
          selectedMilestones.push({
            milestone_id: legalPlanning.id,
            estimated_date: twoMonths.toISOString().split('T')[0],
            tasks: legalPlanning.task_template
          });
        }

        const financial = milestones.find(m => m.name === 'Financial Planning');
        if (financial) {
          const twoMonths = new Date(baseDate);
          twoMonths.setMonth(twoMonths.getMonth() + 2);
          selectedMilestones.push({
            milestone_id: financial.id,
            estimated_date: twoMonths.toISOString().split('T')[0],
            tasks: financial.task_template
          });
        }
      }

      // Always include healthcare setup
      const healthcare = milestones.find(m => m.name === 'Healthcare Team Setup');
      if (healthcare) {
        const threeMonths = new Date(baseDate);
        threeMonths.setMonth(threeMonths.getMonth() + 3);
        selectedMilestones.push({
          milestone_id: healthcare.id,
          estimated_date: threeMonths.toISOString().split('T')[0],
          tasks: healthcare.task_template
        });
      }

      if (assessment.current_mobility !== 'independent' || assessment.cognitive_status === 'moderate_decline') {
        const careOptions = milestones.find(m => m.name === 'Care Options Research');
        if (careOptions) {
          const sixMonths = new Date(baseDate);
          sixMonths.setMonth(sixMonths.getMonth() + 6);
          selectedMilestones.push({
            milestone_id: careOptions.id,
            estimated_date: sixMonths.toISOString().split('T')[0],
            tasks: careOptions.task_template
          });
        }
      }

      // Insert plan milestones
      if (selectedMilestones.length > 0) {
        const { error: insertError } = await supabase
          .from('plan_milestones')
          .insert(selectedMilestones.map(m => ({
            timeline_plan_id: planId,
            ...m
          })));

        if (insertError) throw insertError;

        // Fetch the created milestones with full data
        const { data: planMilestones, error: fetchError } = await supabase
          .from('plan_milestones')
          .select(`
            id,
            estimated_date,
            tasks,
            completed,
            milestone:timeline_milestones(*)
          `)
          .eq('timeline_plan_id', planId)
          .order('estimated_date');

        if (fetchError) throw fetchError;

        const formattedMilestones = planMilestones.map(pm => ({
          id: pm.id,
          milestone: pm.milestone,
          estimated_date: pm.estimated_date,
          tasks: pm.tasks ? pm.tasks.split('\n').filter(t => t.trim()) : [],
          completed: pm.completed
        }));

        setTimeline(formattedMilestones);
      }
    } catch (error) {
      console.error('Error generating timeline:', error);
    }
  };

  const updateMilestone = async (milestoneId: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from('plan_milestones')
        .update({ completed })
        .eq('id', milestoneId);

      if (error) throw error;

      setTimeline(prev => prev.map(m => 
        m.id === milestoneId ? { ...m, completed } : m
      ));

      toast({
        title: completed ? "Milestone Completed!" : "Milestone Updated",
        description: completed ? "Great progress on your care journey!" : "Milestone status updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update milestone. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (step === 1) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary-bright/10 rounded-lg">
                <Calendar className="h-6 w-6 text-primary-bright" />
              </div>
              <div>
                <CardTitle className="text-xl text-text-primary">Care Timeline Planner</CardTitle>
                <CardDescription>
                  Create a personalized care planning timeline based on your current needs
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary">Current Mobility Level</label>
                <Select value={assessment.current_mobility} onValueChange={(value) => setAssessment({...assessment, current_mobility: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select mobility level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="independent">Fully Independent</SelectItem>
                    <SelectItem value="some_assistance">Some Assistance Needed</SelectItem>
                    <SelectItem value="mobility_aid">Uses Mobility Aid</SelectItem>
                    <SelectItem value="wheelchair">Wheelchair Dependent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary">Cognitive Status</label>
                <Select value={assessment.cognitive_status} onValueChange={(value) => setAssessment({...assessment, cognitive_status: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select cognitive status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="mild_decline">Mild Decline</SelectItem>
                    <SelectItem value="moderate_decline">Moderate Decline</SelectItem>
                    <SelectItem value="severe_decline">Severe Decline</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary">Medical Conditions</label>
                <Textarea
                  placeholder="List any current medical conditions or health concerns..."
                  value={assessment.medical_conditions}
                  onChange={(e) => setAssessment({...assessment, medical_conditions: e.target.value})}
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary">Support System</label>
                <Select value={assessment.support_system} onValueChange={(value) => setAssessment({...assessment, support_system: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select support system" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="strong">Strong family/friend support</SelectItem>
                    <SelectItem value="moderate">Some family/friend support</SelectItem>
                    <SelectItem value="limited">Limited support</SelectItem>
                    <SelectItem value="none">No support system</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              onClick={submitAssessment}
              disabled={loading || !assessment.current_mobility || !assessment.cognitive_status || !assessment.support_system}
              className="w-full bg-primary-bright hover:bg-primary-dark text-white"
            >
              {loading ? (
                <>
                  <Calendar className="mr-2 h-4 w-4 animate-spin" />
                  Creating Timeline...
                </>
              ) : (
                <>
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Create Timeline
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary-bright/10 rounded-lg">
                <Calendar className="h-6 w-6 text-primary-bright" />
              </div>
              <div>
                <CardTitle className="text-xl text-text-primary">Your Personalized Care Timeline</CardTitle>
                <CardDescription>
                  Follow these milestones to prepare for your care journey
                </CardDescription>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setStep(1)}
              className="flex items-center space-x-2"
            >
              <ArrowRight className="h-4 w-4 rotate-180" />
              <span>Edit Assessment</span>
            </Button>
          </div>
        </CardHeader>
      </Card>

      <div className="space-y-6">
        {timeline.map((planMilestone, index) => (
          <Card key={planMilestone.id} className={`glass-card transition-all ${planMilestone.completed ? 'border-green-200 bg-green-50/50' : ''}`}>
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  planMilestone.completed 
                    ? 'bg-green-500 text-white' 
                    : 'bg-primary-bright text-white'
                }`}>
                  {planMilestone.completed ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <span className="font-bold">{index + 1}</span>
                  )}
                </div>

                <div className="flex-1 space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-text-primary">
                        {planMilestone.milestone.name}
                      </h3>
                      <Badge variant="outline" className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{new Date(planMilestone.estimated_date).toLocaleDateString()}</span>
                      </Badge>
                    </div>
                    
                    <p className="text-text-secondary mb-3">
                      {planMilestone.milestone.description}
                    </p>

                    <div className="flex items-center space-x-2 mb-3">
                      <Badge variant="secondary" className="text-xs">
                        {planMilestone.milestone.estimated_timeframe}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {planMilestone.milestone.care_level_required} level
                      </Badge>
                    </div>
                  </div>

                  {planMilestone.tasks.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-text-secondary" />
                        <span className="text-sm font-medium text-text-primary">Action Items:</span>
                      </div>
                      <ul className="space-y-1 ml-6">
                        {planMilestone.tasks.map((task, taskIndex) => (
                          <li key={taskIndex} className="text-sm text-text-secondary flex items-start space-x-2">
                            <span className="text-primary-bright mt-1">•</span>
                            <span>{task}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex items-center space-x-2 pt-2">
                    <Checkbox
                      id={`milestone-${planMilestone.id}`}
                      checked={planMilestone.completed}
                      onCheckedChange={(checked) => updateMilestone(planMilestone.id, checked as boolean)}
                    />
                    <label 
                      htmlFor={`milestone-${planMilestone.id}`}
                      className={`text-sm cursor-pointer ${planMilestone.completed ? 'text-green-600 font-medium' : 'text-text-secondary'}`}
                    >
                      {planMilestone.completed ? 'Completed!' : 'Mark as completed'}
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {timeline.length === 0 && (
        <Card className="glass-card">
          <CardContent className="p-8 text-center">
            <Calendar className="h-12 w-12 text-text-secondary mx-auto mb-4" />
            <h3 className="text-lg font-medium text-text-primary mb-2">No Timeline Generated</h3>
            <p className="text-text-secondary">
              There was an issue creating your timeline. Please try completing the assessment again.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TimelinePlanner;
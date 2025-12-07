import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { useCourses } from '../../hooks/useCourse';

export type CorrectAnswer = "A" | "B" | "C" | "D";

interface Question {
  id: number;
  question: string;
  answerA: string;
  answerB: string;
  answerC: string;
  answerD: string;
  correctAnswer: CorrectAnswer;
}

interface QuizAssignmentCreatorProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  submitRef?: React.MutableRefObject<(() => void) | null>;
  teacherId?: string;
  initialData?: any;
}

export const emptyQuestion: Question = {
  id: Date.now(),
  question: "",
  answerA: "",
  answerB: "",
  answerC: "",
  answerD: "",
  correctAnswer: "A",
};

export function QuizAssignmentCreator({
  onSubmit,
  onCancel,
  submitRef,
  teacherId,
  initialData
}: QuizAssignmentCreatorProps) {

  // ===========================
  // LOAD COURSES
  // ===========================
  const { data: coursesData, isLoading: isLoadingCourses, error: coursesError } = useCourses({
    size: 100,
  });

  const myCourses = coursesData?.result
    .filter(course => !teacherId || course.teacher?.userId === teacherId)
    .map(course => ({
      id: course.id.toString(),
      name: course.name,
      code: course.code,
    })) || [];

  // ===========================
  // STATE
  // ===========================
  const [formData, setFormData] = useState({
    courseId: '',
    title: '',
    description: '',
    dueDate: ''
  });

  const [questions, setQuestions] = useState<Question[]>([]);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question>(emptyQuestion);

  // ===========================
  // ⭐ PREFILL EDIT MODE - FIXED
  // ===========================
  useEffect(() => {
    console.log('📝 useEffect triggered - initialData:', initialData);
    
    if (initialData) {
      console.log('📝 initialData.questions:', initialData.questions);
      console.log('📝 Questions count:', initialData.questions?.length);
      
      setFormData({
        courseId: initialData.courseId?.toString() || "",
        title: initialData.title || "",
        description: initialData.description || "",
        dueDate: initialData.dueDate ? initialData.dueDate.slice(0, 16) : ""
      });

      const mappedQuestions = (initialData.questions || []).map((q: any) => {
        console.log('📝 Mapping question:', q);
        return {
          id: q.id || Date.now() + Math.random(),
          question: q.question,
          answerA: q.answerA,
          answerB: q.answerB,
          answerC: q.answerC,
          answerD: q.answerD,
          correctAnswer: q.correctAnswer as CorrectAnswer,
        };
      });
      
      console.log('📝 Final mapped questions:', mappedQuestions);
      setQuestions(mappedQuestions);
    } else {
      // ⭐ RESET về empty khi initialData = null/undefined
      console.log('📝 Resetting to empty state');
      setFormData({
        courseId: '',
        title: '',
        description: '',
        dueDate: ''
      });
      setQuestions([]);
    }
    
    // ⭐ Cleanup function - reset khi component unmount
    return () => {
      console.log('📝 Cleanup - resetting questions');
    };
  }, [initialData]);

  // ===========================
  // EXPOSE SUBMIT TO PARENT
  // ===========================
  useEffect(() => {
    if (submitRef) submitRef.current = handleSubmit;
  }, [formData, questions]);

  // ===========================
  // HANDLERS
  // ===========================
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleQuestionChange = (field: string, value: string) => {
    setCurrentQuestion(prev => ({ ...prev, [field]: value }));
  };

  const openQuestionModal = (index: number | null = null) => {
    if (index !== null) {
      setCurrentQuestion({ ...questions[index] });
      setEditingIndex(index);
    } else {
      setCurrentQuestion({ ...emptyQuestion, id: Date.now() });
      setEditingIndex(null);
    }
    setShowQuestionModal(true);
  };

  const closeQuestionModal = () => {
    setShowQuestionModal(false);
    setEditingIndex(null);
    setCurrentQuestion({ ...emptyQuestion, id: Date.now() });
  };

  const saveQuestion = () => {
    if (!currentQuestion.question.trim()) {
      toast.error('Vui lòng nhập câu hỏi');
      return;
    }

    if (
      !currentQuestion.answerA.trim() ||
      !currentQuestion.answerB.trim() ||
      !currentQuestion.answerC.trim() ||
      !currentQuestion.answerD.trim()
    ) {
      toast.error("Vui lòng nhập đầy đủ 4 đáp án");
      return;
    }

    if (editingIndex !== null) {
      const updated = [...questions];
      updated[editingIndex] = currentQuestion;
      setQuestions(updated);
      toast.success("Đã cập nhật câu hỏi");
    } else {
      setQuestions([...questions, currentQuestion]);
      toast.success("Đã thêm câu hỏi");
    }

    closeQuestionModal();
  };

  const deleteQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
    toast.success("Đã xóa câu hỏi");
  };

  const handleSubmit = () => {
    if (!formData.courseId || !formData.title || !formData.dueDate) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    if (questions.length === 0) {
      toast.error("Phải có ít nhất 1 câu hỏi");
      return;
    }

    // ⭐ Convert dueDate to ISO format
    const dueDateISO = new Date(formData.dueDate).toISOString();
    
    const payload = {
      courseId: parseInt(formData.courseId),
      title: formData.title,
      description: formData.description,
      dueDate: dueDateISO,
      status: initialData ? initialData.status : "DRAFT",
      // ⭐ Gửi đi với field "question" (số ít) theo CreateAssignmentDTO
      question: questions.map(q => ({
        question: q.question,
        answerA: q.answerA,
        answerB: q.answerB,
        answerC: q.answerC,
        answerD: q.answerD,
        correctAnswer: q.correctAnswer
      }))
    };

    console.log('📤 Submitting payload:', payload);
    onSubmit(payload);
  };

  // ===========================
  // UI
  // ===========================
  if (isLoadingCourses) {
    return (
      <div className="space-y-6 py-4">
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Đang tải danh sách lớp...</p>
        </div>
      </div>
    );
  }

  if (coursesError) {
    return (
      <div className="space-y-6 py-4">
        <div className="text-center py-12">
          <p className="text-destructive">Có lỗi khi tải lớp học</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  if (myCourses.length === 0) {
    return (
      <div className="space-y-6 py-4">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Bạn chưa có lớp để tạo bài kiểm tra</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-4">
      {/* FORM */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Lớp học *</Label>
          <Select
            value={formData.courseId}
            onValueChange={(value) => handleInputChange('courseId', value)}
          >
            <SelectTrigger><SelectValue placeholder="Chọn lớp" /></SelectTrigger>
            <SelectContent>
              {myCourses.map(course => (
                <SelectItem key={course.id} value={course.id}>
                  {course.code ? `${course.code} - ${course.name}` : course.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Tiêu đề *</Label>
          <Input
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="VD: Bài kiểm tra chương 1"
          />
        </div>

        <div className="space-y-2">
          <Label>Mô tả</Label>
          <Textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Nhập mô tả..."
          />
        </div>

        <div className="space-y-2">
          <Label>Hạn nộp *</Label>
          <Input
            type="datetime-local"
            value={formData.dueDate}
            onChange={(e) => handleInputChange('dueDate', e.target.value)}
          />
        </div>
      </div>

      {/* QUESTIONS */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-lg">Câu hỏi</h3>
            <p className="text-sm text-muted-foreground">
              Đã thêm {questions.length} câu
            </p>
          </div>

          <Button onClick={() => openQuestionModal()} variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Thêm câu hỏi
          </Button>
        </div>

        <div className="border rounded-lg bg-gray-50 p-3">
          <div className="max-h-[350px] overflow-y-auto pr-2 space-y-3">
            {questions.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="py-6 text-center text-muted-foreground">
                  Chưa có câu hỏi
                </CardContent>
              </Card>
            ) : (
              questions.map((q, index) => (
                <Card key={q.id}>
                  <CardContent className="pt-3 pb-3">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline">Câu {index + 1}</Badge>
                          <Badge variant="secondary" className="text-green-700 bg-green-50">
                            Đáp án: {q.correctAnswer}
                          </Badge>
                        </div>
                        <p className="font-medium text-sm">{q.question}</p>
                      </div>

                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => openQuestionModal(index)}>
                          <Edit2 className="w-4 h-4" />
                        </Button>

                        <Button variant="ghost" size="sm" className="text-destructive" onClick={() => deleteQuestion(index)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {(['A','B','C','D'] as const).map(letter => {
                        const value = q[`answer${letter}` as keyof Question] as string;
                        const isCorrect = q.correctAnswer === letter;

                        return (
                          <div
                            key={letter}
                            className={`p-2 rounded border ${
                              isCorrect ? 'bg-green-50 border-green-300' : 'bg-white border-gray-200'
                            }`}
                          >
                            <span className="font-semibold">{letter}.</span> {value}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>

      {/* MODAL QUESTION */}
      <Dialog open={showQuestionModal} onOpenChange={setShowQuestionModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingIndex !== null ? "Chỉnh sửa câu hỏi" : "Thêm câu hỏi"}
            </DialogTitle>
            <DialogDescription>
              Nhập nội dung câu hỏi và các đáp án.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Câu hỏi *</Label>
              <Textarea
                value={currentQuestion.question}
                onChange={(e) => handleQuestionChange('question', e.target.value)}
                rows={3}
                placeholder="Nhập nội dung câu hỏi..."
              />
            </div>

            <div className="space-y-3">
              {['A','B','C','D'].map(letter => (
                <div key={letter} className="space-y-2">
                  <Label>Đáp án {letter} *</Label>
                  <Input
                    value={currentQuestion[`answer${letter}` as keyof Question] as string}
                    onChange={(e) => handleQuestionChange(`answer${letter}`, e.target.value)}
                    placeholder={`Nhập đáp án ${letter}`}
                  />
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Label>Đáp án đúng *</Label>
              <Select
                value={currentQuestion.correctAnswer}
                onValueChange={(value: Question['correctAnswer']) =>
                  handleQuestionChange('correctAnswer', value)
                }
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">A</SelectItem>
                  <SelectItem value="B">B</SelectItem>
                  <SelectItem value="C">C</SelectItem>
                  <SelectItem value="D">D</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeQuestionModal}>Hủy</Button>
            <Button onClick={saveQuestion}>
              {editingIndex !== null ? "Cập nhật" : "Thêm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
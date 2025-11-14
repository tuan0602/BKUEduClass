package com.bk.eduClass.service;
import com.bk.eduClass.dto.CourseDTO;

import java.util.List;

public interface CourseService {
    CourseDTO getById(String courseId);
    List<CourseDTO> getAll();
    CourseDTO create(CourseDTO courseDTO);
    CourseDTO update(String courseId, CourseDTO courseDTO);
    void delete(String courseId);
}

package com.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.repository.HomeRepository;
import com.example.demo.vo.Painting;

@Service
public class HomeService {
	
    @Autowired
    private HomeRepository homeRepository; 

	public List<Painting> getPaintingList() {
		return homeRepository.getPaintingList();
	}

}

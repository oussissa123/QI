package com.limos.fr.mod;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class Home {

	@GetMapping("/")
	public ModelAndView home() {
		ModelAndView m = new ModelAndView("home");
		return m;
	}
	
	
	
}

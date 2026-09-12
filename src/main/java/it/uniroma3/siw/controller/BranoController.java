package it.uniroma3.siw.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import it.uniroma3.siw.model.Artista;
import it.uniroma3.siw.model.Brano;
import it.uniroma3.siw.service.ArtistaService;
import it.uniroma3.siw.service.BranoService;
import jakarta.validation.Valid;

@Controller
public class BranoController {
	private BranoService branoService;
	private ArtistaService artistaService;
	
	public BranoController(BranoService branoService, ArtistaService artistaService) {
		this.branoService = branoService;
		this.artistaService=artistaService;
	}
	
	@GetMapping("/brani/{id}")
	public String show(@PathVariable("id") Long id, Model model) {
		Brano brano = this.branoService.findById(id);
		model.addAttribute("brano", brano);
		return "brani/show";
	}
	
	
	@GetMapping("/brani")
	public String list(Model model) {
		List<Brano> listaBrani = this.branoService.findAll();
		model.addAttribute("brani", listaBrani);
		model.addAttribute("braniNum", listaBrani.size());
		return "brani/list";
	}
	
	@GetMapping("/brani/new")
	public String form(Model model) {	
		model.addAttribute("brano", new Brano());
		model.addAttribute("artisti", this.artistaService.findAll());
		return "brani/form";
	}
	
	@PostMapping("/brani")
	public String save(@Valid @ModelAttribute("brano") Brano brano, BindingResult bindingResult, @RequestParam(required=false) List<Long> artistiIds, Model model) {
		
		if (brano.getAutore() != null && artistiIds != null) {
			if (artistiIds.contains(brano.getAutore().getId())) {
				bindingResult.rejectValue("featuring", "Brano.featuring.autoreCoincide", "L'autore principale non può essere inserito anche nel featuring!");
			}
		}
		if (bindingResult.hasErrors()) {
			model.addAttribute("artisti", this.artistaService.findAll());
			return "brani/form";
		}
		brano.setFeaturing(new ArrayList<>());
		if (artistiIds != null) {
			for (Long id : artistiIds) {
				brano.getFeaturing().add(this.artistaService.findById(id));
			}
		}		
		this.branoService.save(brano);
		return "redirect:/brani";
	}
	
	
}

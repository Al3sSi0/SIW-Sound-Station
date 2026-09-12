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

import it.uniroma3.siw.model.Album;
import it.uniroma3.siw.model.Artista;
import it.uniroma3.siw.model.Brano;
import it.uniroma3.siw.service.AlbumService;
import it.uniroma3.siw.service.ArtistaService;
import it.uniroma3.siw.service.BranoService;
import jakarta.validation.Valid;

@Controller
public class AlbumController {
	private AlbumService albumService;
	private ArtistaService artistaService;
	private BranoService branoService;
	
	public AlbumController(AlbumService albumService, ArtistaService artistaService, BranoService branoService) {
		this.albumService = albumService;
		this.artistaService =  artistaService;
		this.branoService = branoService;
	}
	
	@GetMapping("/albums/{id}")
	public String show(@PathVariable("id") Long id, Model model) {
		Album album = this.albumService.findById(id);
		model.addAttribute("album",album);
		return "albums/show";
	}
	
	@GetMapping("/albums")
	public String list(Model model) {
		List<Album> listaAlbums = this.albumService.findAll();
		model.addAttribute("albums", listaAlbums);
		model.addAttribute("albumsNum", listaAlbums.size());
		return "albums/list";
	}
	
	@GetMapping("/albums/new")
	public String form(Model model) {
		model.addAttribute("album", new Album());
		model.addAttribute("artisti", this.artistaService.findAll());
		return "albums/form";
	}
	
	
	@PostMapping("/albums")
	public String save(@Valid @ModelAttribute("album") Album album, BindingResult bindingResult, Model model) {
		if(bindingResult.hasErrors()) {
			model.addAttribute("artisti", this.artistaService.findAll());
			return "albums/form"; 
		}
		this.albumService.save(album);
		return "redirect:/albums/" + album.getId() + "/addBrani";
	}
	
	@GetMapping("/albums/{id}/addBrani")
	public String formAdd(@PathVariable("id") Long id, Model model) {
		Album album = this.albumService.findById(id);
		Artista autore = album.getAutore();
		List<Brano> braniDisponibili = new ArrayList<>();
		if (autore != null && autore.getBraniIncisi() != null && autore.getBraniIncisi().isEmpty()==false) {
			for(Brano b:autore.getBraniIncisi()) {
				if(b.getAlbum()==null) {
					braniDisponibili.add(b);
				}
			}
		}
		model.addAttribute("album", album);
		model.addAttribute("braniDisponibili", braniDisponibili);
		return "albums/formBrani";
	}
	
	@PostMapping("/albums/{id}/addBrani")
	public String saveBrani(@PathVariable("id") Long id, @RequestParam(required=false) List<Long> braniIds) {
		Album album = this.albumService.findById(id);
		if(braniIds != null) {
			for(Long branoId : braniIds) {
				Brano brano = this.branoService.findById(branoId);
				brano.setAlbum(album);
				album.getBrani().add(brano);
			}
			this.albumService.save(album);
		}
		return "redirect:/albums";
	}
	
	
	
	
}
	
	


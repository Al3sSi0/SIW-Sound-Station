package it.uniroma3.siw.controller;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import it.uniroma3.siw.model.Album;
import it.uniroma3.siw.model.Brano;
import it.uniroma3.siw.model.Credentials;
import it.uniroma3.siw.model.Playlist;
import it.uniroma3.siw.model.User;
import it.uniroma3.siw.service.BranoService;
import it.uniroma3.siw.service.CredentialsService;
import it.uniroma3.siw.service.PlaylistService;
import jakarta.validation.Valid;

@Controller
public class PlaylistController {
	private PlaylistService playlistService;
	private CredentialsService credentialsService;
	private BranoService branoService;
	
	public PlaylistController(PlaylistService playlistService, CredentialsService credentialsService,BranoService branoService) {
		this.playlistService = playlistService;
		this.credentialsService = credentialsService;
		this.branoService = branoService;
	}
	
	@GetMapping("/playlists/{id}")
	public String show(@PathVariable("id") Long id, Model model) {
		Playlist playlist = this.playlistService.findById(id);
		model.addAttribute("playlist", playlist);
		return "playlists/show";
	}
	
	@GetMapping("/playlists/new")
	public String form(Model model) {
		model.addAttribute("playlist", new Playlist());
		return "playlists/form";
	}
	
	@GetMapping("/playlists/{id}/addBrani")
	public String formAdd(@PathVariable("id")Long id, Model model) {
		model.addAttribute("playlist", this.playlistService.findById(id));
		model.addAttribute("brani", this.branoService.findAll());
		return "playlists/formAdd";
	}
	
	@PostMapping("/playlists")
	public String save(@Valid @ModelAttribute("playlist") Playlist playlist, BindingResult bindingResult) {
		if(bindingResult.hasErrors()) {
			return "playlists/form"; 
		}
		UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal(); 
		Credentials credentials = this.credentialsService.getCredentials(userDetails.getUsername()); 
		User utenteCorrente = credentials.getUser(); 
		playlist.setUtente(utenteCorrente);
		playlist.setDataCreazione(LocalDate.now());
		this.playlistService.save(playlist);
		return "redirect:/playlists/" + playlist.getId();
	}
	
	@PostMapping("/playlists/{id}/addBrani")
	public String saveBrani(@PathVariable("id") Long id, @RequestParam(required=false) List<Long> braniIds) {
		Playlist playlist = this.playlistService.findById(id);
		if(braniIds != null) {
			for(Long branoId : braniIds) {
				Brano brano = this.branoService.findById(branoId);
				brano.setPlaylists(new ArrayList<>());
				brano.getPlaylists().add(playlist);
				playlist.getBrani().add(brano);
			}
			this.playlistService.save(playlist);
		}
		return "redirect:/playlists/"+ playlist.getId();
	}
	
	
	
	
}

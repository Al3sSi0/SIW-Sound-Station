package it.uniroma3.siw.controller;

import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import it.uniroma3.siw.model.Credentials;
import it.uniroma3.siw.model.Playlist;
import it.uniroma3.siw.model.User;
import it.uniroma3.siw.service.CredentialsService;
import it.uniroma3.siw.service.PlaylistService;
import it.uniroma3.siw.service.UserService;

@Controller
public class UserController {
	private final CredentialsService credentialsService;
    private final PlaylistService playlistService;

    public UserController(CredentialsService credentialsService, PlaylistService playlistService) {
        this.credentialsService = credentialsService;
        this.playlistService = playlistService;
    }
	
	@GetMapping("/profile")
    public String mostraProfiloPersonale(Model model) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Credentials credentials = this.credentialsService.getCredentials(userDetails.getUsername());
        User utenteCorrente = credentials.getUser();
        List<Playlist> playlistUtente = this.playlistService.findByUtente(utenteCorrente);
        
        model.addAttribute("user", utenteCorrente);
        model.addAttribute("username", credentials.getUsername());
        model.addAttribute("playlists", playlistUtente);
   
        return "user/profilo";
    }
}

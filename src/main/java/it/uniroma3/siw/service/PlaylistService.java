package it.uniroma3.siw.service;

import java.util.List;

import org.springframework.stereotype.Service;

import it.uniroma3.siw.model.Playlist;
import it.uniroma3.siw.model.User;
import it.uniroma3.siw.repository.PlaylistRepository;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;

@Service
public class PlaylistService {
	private PlaylistRepository playlistRepository;
	
	public PlaylistService(PlaylistRepository playlistRepository) {
		this.playlistRepository = playlistRepository;
	}

	public Playlist findById(Long id) {
		return this.playlistRepository.findById(id).get();
	}

	public List<Playlist> findAll() {
		return (List<Playlist>) this.playlistRepository.findAll();
	}

	public Playlist save(@Valid Playlist playlist) {
		return this.playlistRepository.save(playlist);		
	}

	public List<Playlist> findByUtente(User utenteCorrente) {
		return this.playlistRepository.findByUtente(utenteCorrente);
	}
	
	@Transactional
	public void delete(Playlist playlistEsistente) {
		this.playlistRepository.delete(playlistEsistente);
		
	}
}

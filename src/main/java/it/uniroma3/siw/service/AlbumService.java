package it.uniroma3.siw.service;

import java.util.List;

import org.springframework.stereotype.Service;

import it.uniroma3.siw.model.Album;
import it.uniroma3.siw.repository.AlbumRepository;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;

@Service
public class AlbumService {
	private AlbumRepository albumRepository;
	
	public AlbumService(AlbumRepository albumRepository) {
		this.albumRepository = albumRepository;
	}

	public List<Album> findAll() {
		return (List<Album>) this.albumRepository.findAll();
	}

	public Album findById(Long id) {
		return this.albumRepository.findById(id).get();
	}

	public void save(@Valid Album album) {
		this.albumRepository.save(album);
	}
	
	
	@Transactional
	public void delete(Album albumEsistente) {
		this.albumRepository.delete(albumEsistente);
	}
}
